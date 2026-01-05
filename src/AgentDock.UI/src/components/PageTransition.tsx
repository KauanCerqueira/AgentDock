import React, { useState, useEffect } from 'react'

interface PageTransitionProps {
  children: React.ReactNode
  isLoading?: boolean
}

export function PageTransition({ children, isLoading = false }: PageTransitionProps) {
  const [showContent, setShowContent] = useState(!isLoading)
  const [displayChild, setDisplayChild] = useState(children)

  useEffect(() => {
    if (!isLoading) {
      setShowContent(true)
      setDisplayChild(children)
    } else {
      setShowContent(false)
    }
  }, [isLoading, children])

  return (
    <div
      style={{
        opacity: showContent ? 1 : 0.5,
        transition: 'opacity 0.3s ease-in-out',
        pointerEvents: isLoading ? 'none' : 'auto'
      }}
    >
      {isLoading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#0A0A0A',
          color: '#888',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #333',
              borderTop: '3px solid #fff',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem'
            }} />
            Carregando página...
          </div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        displayChild
      )}
    </div>
  )
}
