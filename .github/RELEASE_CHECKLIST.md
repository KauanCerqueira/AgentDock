# Release Checklist

## Before Creating a Release

- [ ] Update version in `package.json`
- [ ] Update version in `src/AgentDock.Backend/AgentDock.Backend.csproj`
- [ ] Update CHANGELOG.md with new features/fixes
- [ ] Test build on all platforms (Windows, macOS, Linux)
- [ ] Verify llama.cpp variants download correctly
- [ ] Test installer/portable versions
- [ ] Update screenshots if UI changed
- [ ] Review and update documentation

## Creating a Release

1. Create and push a version tag:
```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

2. GitHub Actions will automatically:
   - Build installers for all platforms
   - Create GitHub Release
   - Upload artifacts

3. After automation completes:
   - Edit release notes on GitHub
   - Add highlights and breaking changes
   - Publish release (if draft)

## Post-Release

- [ ] Announce on social media/forums
- [ ] Monitor issue tracker for bugs
- [ ] Prepare hotfix if critical issues found
- [ ] Update project roadmap

## Release Artifacts

Each release should include:

### Windows
- `AgentDock-Setup-x.x.x.exe` (installer)
- `AgentDock-x.x.x-portable.exe` (portable)

### macOS
- `AgentDock-x.x.x.dmg` (installer)
- `AgentDock-x.x.x-mac.zip` (alternative)

### Linux
- `AgentDock-x.x.x.AppImage` (universal)
- `AgentDock-x.x.x.deb` (Debian/Ubuntu)

### Documentation
- Release notes
- Changelog
- Known issues
- Upgrade instructions

## Versioning

Follow Semantic Versioning (semver):
- MAJOR version: Breaking changes
- MINOR version: New features (backward-compatible)
- PATCH version: Bug fixes (backward-compatible)

Example: `v1.2.3`
- 1 = Major
- 2 = Minor
- 3 = Patch
