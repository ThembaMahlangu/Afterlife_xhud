import { React, useState, useEffect, useCallback, useMemo } from "react";
import Fade from "../utils/fade";
import { NuiEvent } from "../hooks/NuiEvent";
import { useSelector } from "react-redux";

const ProgressBarExport = () => {
  const [progressBars, setProgressBars] = useState([]);
  const settings = useSelector((state) => state.settings);

  const handleProgressBar = useCallback((data) => {
    const progressBar = {
      id: Date.now() + Math.random(),
      ...data,
      timestamp: Date.now(),
      progress: 0,
      visible: true,
      duration: data.duration || 5000,
      startTime: Date.now(),
      isAnimating: true,
      wasCancelled: false,
      canCancel: data.canCancel !== false,
      label: data.label || data.title || 'Progress' 
    };
    
    setProgressBars(prev => [...prev, progressBar]);
    
    if (data.duration && data.duration > 0) {
      const animationInterval = setInterval(() => {
        setProgressBars(prev => 
          prev.map(pb => {
            if (pb.id === progressBar.id && pb.isAnimating && !pb.wasCancelled) {
              const elapsed = Date.now() - pb.startTime;
              const progress = Math.min(100, (elapsed / pb.duration) * 100);
              
              if (progress >= 100) {
                clearInterval(animationInterval);
                return { ...pb, progress: 100, isAnimating: false, visible: false };
              }
              
              return { ...pb, progress: progress };
            }
            return pb;
          })
        );
      }, 16); 
      
      setTimeout(() => {
        clearInterval(animationInterval);
        setProgressBars(prev => 
          prev.map(pb => 
            pb.id === progressBar.id 
              ? { ...pb, progress: 100, visible: false, isAnimating: false }
              : pb
          )
        );
        
        fetch(`https://${GetParentResourceName()}/FinishAction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        }).catch(err => console.error('Failed to send completion callback:', err));
        
        setTimeout(() => {
          setProgressBars(prev => prev.filter(pb => pb.id !== progressBar.id));
        }, 100);
      }, data.duration);
    }
  }, []);

  const handleProgressUpdate = useCallback((data) => {
    requestAnimationFrame(() => {
      setProgressBars(prev => 
        prev.map(pb => 
          pb.id === data.id 
            ? { ...pb, progress: data.progress, label: data.label || pb.label || 'Progress' }
            : pb
        )
      );
    });
  }, []);

  const handleProgressComplete = useCallback((data) => {
    requestAnimationFrame(() => {
      setProgressBars(prev => 
        prev.map(pb => 
          pb.id === data.id 
            ? { ...pb, progress: 100, visible: false, isAnimating: false }
            : pb
        )
      );
    });
    
    setTimeout(() => {
      setProgressBars(prev => prev.filter(pb => pb.id !== data.id));
    }, 100); 
  }, []);

  const handleProgressCancel = useCallback((data) => {
    if (data.id === 'all') {
      setProgressBars([]);
    } else {
      setProgressBars(prev => 
        prev.map(pb => 
          pb.id === data.id 
            ? { ...pb, wasCancelled: true, isAnimating: false, visible: false }
            : pb
        )
      );
      
      setTimeout(() => {
        setProgressBars(prev => prev.filter(pb => pb.id !== data.id));
      }, 1000);
    }
  }, []);

  const handleProgress = useCallback((data) => {
    const progressBar = {
      id: 'progress_' + Date.now(),
      title: data.label || 'Progress',
      description: '',
      progress: 0,
      visible: true,
      duration: data.duration || 5000,
      startTime: Date.now(),
      isAnimating: true,
      wasCancelled: false,
      canCancel: true,
      type: 'info',
      label: data.label || 'Progress' 
    };
    
    setProgressBars(prev => [...prev, progressBar]);
    
    if (data.duration && data.duration > 0) {
      const animationInterval = setInterval(() => {
        setProgressBars(prev => 
          prev.map(pb => {
            if (pb.id === progressBar.id && pb.isAnimating && !pb.wasCancelled) {
              const elapsed = Date.now() - pb.startTime;
              const progress = Math.min(100, (elapsed / pb.duration) * 100);
              
              if (progress >= 100) {
                clearInterval(animationInterval);
                return { ...pb, progress: 100, isAnimating: false, visible: false };
              }
              
              return { ...pb, progress: progress };
            }
            return pb;
          })
        );
      }, 16);
      
      setTimeout(() => {
        clearInterval(animationInterval);
        setProgressBars(prev => 
          prev.map(pb => 
            pb.id === progressBar.id 
              ? { ...pb, progress: 100, visible: false, isAnimating: false }
              : pb
          )
        );
        
        fetch(`https://${GetParentResourceName()}/FinishAction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        }).catch(err => console.error('Failed to send completion callback:', err));
        
        setTimeout(() => {
          setProgressBars(prev => prev.filter(pb => pb.id !== progressBar.id));
        }, 100);
      }, data.duration);
    }
  }, []);

  const handleCancel = useCallback(() => {
    setProgressBars(prev => 
      prev.map(pb => 
        pb.canCancel 
          ? { ...pb, wasCancelled: true, isAnimating: false, visible: false }
          : pb
      )
    );
    
    setTimeout(() => {
      setProgressBars(prev => prev.filter(pb => !pb.wasCancelled));
    }, 1000);
  }, []);

  NuiEvent("progress", handleProgress);
  NuiEvent("cancel", handleCancel);
  
  NuiEvent("progressBarExport", handleProgressBar);
  NuiEvent("progressBarUpdate", handleProgressUpdate);
  NuiEvent("progressBarComplete", handleProgressComplete);
  NuiEvent("progressBarCancel", handleProgressCancel);
  NuiEvent("progressBarCancelAll", () => setProgressBars([]));

  const ProgressBarItem = useMemo(() => {
    return ({ progressBar }) => (
      <Fade key={progressBar.id} in={progressBar.visible}>
        <div 
          className="progressbar-export-card" 
          data-type={progressBar.type || 'info'}
          style={{
            borderLeftColor: progressBar.type === 'error' ? '#ff4444' : 
                           progressBar.type === 'warning' ? '#FF9800' : 
                           progressBar.type === 'success' ? '#4CAF50' : '#2196F3'
          }}
        >
          <div className="progressbar-export-icon">
            <span className="material-symbols-outlined">
              {progressBar.icon || 
               (progressBar.type === 'error' ? 'error' :
                progressBar.type === 'warning' ? 'warning' :
                progressBar.type === 'success' ? 'check_circle' : 'info')}
            </span>
          </div>
          <div className="progressbar-export-content">
            <div className="progressbar-export-title">{progressBar.title}</div>
            <div className="progressbar-export-description">{progressBar.description}</div>
            <div className="progressbar-export-bar">
              <div 
                className="progressbar-export-fill"
                style={{ 
                  width: `${Math.min(100, Math.max(0, progressBar.progress))}%`,
                  backgroundColor: progressBar.type === 'error' ? '#ff4444' : 
                                progressBar.type === 'warning' ? '#FF9800' : 
                                progressBar.type === 'success' ? '#4CAF50' : '#2196F3'
                }}
              ></div>
            </div>
            <div className="progressbar-export-label">
              {progressBar.wasCancelled ? 'CANCELLED' : (progressBar.label || `${Math.round(progressBar.progress)}%`)}
            </div>
            {progressBar.canCancel !== false && progressBar.isAnimating && !progressBar.wasCancelled && (
              <div className="progressbar-export-tip">Press X to cancel</div>
            )}
          </div>
        </div>
      </Fade>
    );
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if ((event.key === 'x' || event.key === 'X') && progressBars.length > 0) {
        const cancellableBars = progressBars.filter(pb => pb.canCancel !== false && pb.isAnimating);
        if (cancellableBars.length > 0) {
          const latestBar = cancellableBars[cancellableBars.length - 1];
          
          fetch(`https://${GetParentResourceName()}/FinishAction`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
          }).catch(err => console.error('Failed to send FinishAction:', err));
          
          handleProgressCancel({ id: latestBar.id });
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [progressBars, handleProgressCancel]);

  useEffect(() => {
    const handleFinishAction = (data, cb) => {
      console.log('FinishAction received:', data);
      cb('ok');
    };

    const handleMessage = (event) => {
      if (event.data.action === 'FinishAction') {
        handleFinishAction(event.data, () => {});
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <>
      <Fade in={settings.showinfo}>
        <div className="progressbar-export-wrapper">
          <div className="progressbar-export-container">
            {progressBars.map((progressBar) => (
              <ProgressBarItem key={progressBar.id} progressBar={progressBar} />
            ))}
          </div>
        </div>
      </Fade>
    </>
  );
};

export default ProgressBarExport;
