using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Linq;
using System.Collections.Generic;
using System.IO;
using LibreHardwareMonitor.Hardware;

namespace AgentDock.Backend.Services;

public class SystemStats
{
    public double CpuUsagePercent { get; set; }
    public double TotalMemoryGb { get; set; }
    public double UsedMemoryGb { get; set; }
    public double AvailableMemoryGb { get; set; }
    public string OsDescription { get; set; } = string.Empty;
    public string Architecture { get; set; } = string.Empty;
    public int ProcessCount { get; set; }
    public string UpTime { get; set; } = string.Empty;
    public List<DiskInfo> Disks { get; set; } = new();
    public List<ProcessInfo> TopProcesses { get; set; } = new();
    public GpuInfo? GpuInfo { get; set; }
    public NetworkInfo NetworkInfo { get; set; } = new();
}

public class DiskInfo
{
    public string Name { get; set; } = string.Empty;
    public double TotalSizeGb { get; set; }
    public double FreeSpaceGb { get; set; }
    public double UsedSpaceGb { get; set; }
    public double UsagePercent { get; set; }
}

public class ProcessInfo
{
    public string Name { get; set; } = string.Empty;
    public int Id { get; set; }
    public double MemoryMb { get; set; }
}

public class GpuInfo
{
    public string Name { get; set; } = string.Empty;
    public double UsagePercent { get; set; }
    public double TemperatureCelsius { get; set; }
    public double MemoryUsedGb { get; set; }
    public double MemoryTotalGb { get; set; }
    public double MemoryUsagePercent { get; set; }
}

public class NetworkInfo
{
    public double DownloadSpeedMbps { get; set; }
    public double UploadSpeedMbps { get; set; }
    public double TotalDownloadedGb { get; set; }
    public double TotalUploadedGb { get; set; }
}

public class SystemMonitorService
{
    private static PerformanceCounter? _cpuCounter;
    private static PerformanceCounter? _ramCounter;
    private static Computer? _computer;
    private static readonly object _lock = new object();
    private static bool _initialized = false;
    
    // Network monitoring
    private static PerformanceCounter? _networkBytesReceivedCounter;
    private static PerformanceCounter? _networkBytesSentCounter;
    private static long _lastNetworkBytesReceived = 0;
    private static long _lastNetworkBytesSent = 0;
    private static DateTime _lastNetworkCheck = DateTime.UtcNow;

    public SystemMonitorService()
    {
        if (!_initialized)
        {
            lock (_lock)
            {
                if (!_initialized)
                {
                    InitializeCounters();
                    InitializeHardwareMonitor();
                    _initialized = true;
                }
            }
        }
    }

    private void InitializeCounters()
    {
        if (!RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            return;

        try
        {
            _cpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total");
            _ramCounter = new PerformanceCounter("Memory", "Available MBytes");
            
            // First call to NextValue() always returns 0, so we call it here
            _cpuCounter.NextValue();
            _ramCounter.NextValue();

            // Initialize network counters
            var networkCategory = new PerformanceCounterCategory("Network Interface");
            var instances = networkCategory.GetInstanceNames()
                .Where(i => !i.Contains("Loopback") && !i.Contains("Teredo"))
                .FirstOrDefault();

            if (instances != null)
            {
                _networkBytesReceivedCounter = new PerformanceCounter("Network Interface", "Bytes Received/sec", instances);
                _networkBytesSentCounter = new PerformanceCounter("Network Interface", "Bytes Sent/sec", instances);
                _networkBytesReceivedCounter.NextValue();
                _networkBytesSentCounter.NextValue();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to initialize performance counters: {ex.Message}");
        }
    }

    private void InitializeHardwareMonitor()
    {
        try
        {
            _computer = new Computer
            {
                IsGpuEnabled = true,
                IsCpuEnabled = true,
                IsMemoryEnabled = true,
                IsNetworkEnabled = true
            };
            _computer.Open();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to initialize hardware monitor: {ex.Message}");
            _computer = null;
        }
    }

    public SystemStats GetSystemStats()
    {
        var uptime = TimeSpan.FromMilliseconds(Environment.TickCount64);
        var stats = new SystemStats
        {
            OsDescription = RuntimeInformation.OSDescription,
            Architecture = RuntimeInformation.OSArchitecture.ToString(),
            ProcessCount = Process.GetProcesses().Length,
            UpTime = $"{uptime.Days}d {uptime.Hours}h {uptime.Minutes}m"
        };

        // Get Disk Info
        try
        {
            foreach (var drive in DriveInfo.GetDrives().Where(d => d.IsReady && d.DriveType == DriveType.Fixed))
            {
                var total = drive.TotalSize / 1024.0 / 1024.0 / 1024.0;
                var free = drive.AvailableFreeSpace / 1024.0 / 1024.0 / 1024.0;
                var used = total - free;
                
                stats.Disks.Add(new DiskInfo
                {
                    Name = drive.Name,
                    TotalSizeGb = total,
                    FreeSpaceGb = free,
                    UsedSpaceGb = used,
                    UsagePercent = (used / total) * 100
                });
            }
        }
        catch { /* Ignore disk errors */ }

        // Get Top Processes by Memory
        try
        {
            stats.TopProcesses = Process.GetProcesses()
                .OrderByDescending(p => p.WorkingSet64)
                .Take(5)
                .Select(p => new ProcessInfo
                {
                    Name = p.ProcessName,
                    Id = p.Id,
                    MemoryMb = p.WorkingSet64 / 1024.0 / 1024.0
                })
                .ToList();
        }
        catch { /* Ignore process access errors */ }

        // Get GPU Info
        stats.GpuInfo = GetGpuInfo();

        // Get Network Info
        stats.NetworkInfo = GetNetworkInfo();

        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            GetWindowsMetrics(stats);
        }
        else
        {
            // Fallback for non-Windows
            var process = Process.GetCurrentProcess();
            stats.UsedMemoryGb = process.WorkingSet64 / 1024.0 / 1024.0 / 1024.0;
            stats.TotalMemoryGb = 16.0; // Default assumption
            stats.AvailableMemoryGb = stats.TotalMemoryGb - stats.UsedMemoryGb;
            stats.CpuUsagePercent = 0;
        }

        return stats;
    }

    private GpuInfo? GetGpuInfo()
    {
        try
        {
            if (_computer == null)
                return null;

            _computer.Accept(new UpdateVisitor());

            var gpu = _computer.Hardware.FirstOrDefault(h => h.HardwareType == HardwareType.GpuNvidia || 
                                                              h.HardwareType == HardwareType.GpuAmd ||
                                                              h.HardwareType == HardwareType.GpuIntel);

            if (gpu == null)
                return null;

            var gpuInfo = new GpuInfo
            {
                Name = gpu.Name
            };

            foreach (var sensor in gpu.Sensors)
            {
                if (sensor.SensorType == SensorType.Load && sensor.Name.Contains("GPU Core"))
                    gpuInfo.UsagePercent = sensor.Value ?? 0;
                else if (sensor.SensorType == SensorType.Temperature && sensor.Name.Contains("GPU Core"))
                    gpuInfo.TemperatureCelsius = sensor.Value ?? 0;
                else if (sensor.SensorType == SensorType.SmallData && sensor.Name.Contains("GPU Memory Used"))
                    gpuInfo.MemoryUsedGb = (sensor.Value ?? 0) / 1024.0;
                else if (sensor.SensorType == SensorType.SmallData && sensor.Name.Contains("GPU Memory Total"))
                    gpuInfo.MemoryTotalGb = (sensor.Value ?? 0) / 1024.0;
            }

            if (gpuInfo.MemoryTotalGb > 0)
                gpuInfo.MemoryUsagePercent = (gpuInfo.MemoryUsedGb / gpuInfo.MemoryTotalGb) * 100;

            return gpuInfo;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error getting GPU info: {ex.Message}");
            return null;
        }
    }

    private NetworkInfo GetNetworkInfo()
    {
        var networkInfo = new NetworkInfo();

        try
        {
            if (_networkBytesReceivedCounter != null && _networkBytesSentCounter != null)
            {
                var now = DateTime.UtcNow;
                var timeDelta = (now - _lastNetworkCheck).TotalSeconds;

                if (timeDelta > 0)
                {
                    var bytesReceived = _networkBytesReceivedCounter.NextValue();
                    var bytesSent = _networkBytesSentCounter.NextValue();

                    // Convert bytes/sec to Mbps (Megabits per second)
                    networkInfo.DownloadSpeedMbps = (bytesReceived * 8) / 1_000_000;
                    networkInfo.UploadSpeedMbps = (bytesSent * 8) / 1_000_000;

                    // Track total transferred (cumulative)
                    _lastNetworkBytesReceived += (long)bytesReceived;
                    _lastNetworkBytesSent += (long)bytesSent;

                    networkInfo.TotalDownloadedGb = _lastNetworkBytesReceived / 1_000_000_000.0;
                    networkInfo.TotalUploadedGb = _lastNetworkBytesSent / 1_000_000_000.0;

                    _lastNetworkCheck = now;
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error getting network info: {ex.Message}");
        }

        // Always return a NetworkInfo object, even if empty (zeros)
        return networkInfo;
    }

    private void GetWindowsMetrics(SystemStats stats)
    {
        try
        {
            var gcInfo = GC.GetGCMemoryInfo();
            stats.TotalMemoryGb = gcInfo.TotalAvailableMemoryBytes / 1024.0 / 1024.0 / 1024.0;

            if (_cpuCounter != null && _ramCounter != null)
            {
                stats.CpuUsagePercent = _cpuCounter.NextValue();
                stats.AvailableMemoryGb = _ramCounter.NextValue() / 1024.0; // Convert MB to GB
                stats.UsedMemoryGb = stats.TotalMemoryGb - stats.AvailableMemoryGb;
            }
            else
            {
                // Fallback if counters failed to initialize
                var process = Process.GetCurrentProcess();
                stats.UsedMemoryGb = process.WorkingSet64 / 1024.0 / 1024.0 / 1024.0;
                stats.AvailableMemoryGb = stats.TotalMemoryGb - stats.UsedMemoryGb;
                stats.CpuUsagePercent = 0;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error getting Windows metrics: {ex.Message}");
            // Safe fallback
            stats.CpuUsagePercent = 0;
            stats.TotalMemoryGb = 16.0;
            stats.UsedMemoryGb = 4.0;
            stats.AvailableMemoryGb = 12.0;
        }
    }

    private class UpdateVisitor : IVisitor
    {
        public void VisitComputer(IComputer computer)
        {
            computer.Traverse(this);
        }

        public void VisitHardware(IHardware hardware)
        {
            hardware.Update();
            foreach (var subHardware in hardware.SubHardware)
                subHardware.Accept(this);
        }

        public void VisitSensor(ISensor sensor) { }
        public void VisitParameter(IParameter parameter) { }
    }
}
