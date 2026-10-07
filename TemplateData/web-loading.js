// Runs the loading screen exported from a Unity canvas (Tools > 8th Wall > Loading Screen).
// Scales it the way the canvas's CanvasScaler would, fills the progress bar, and fades it out.
(function () {
  var root = document.getElementById('web-loading-screen');
  if (!root) {
    // Nothing exported yet: keep the hooks the template calls.
    window.setWebLoadingProgress = function () {};
    window.hideWebLoadingScreen = function () {};
    window.webLoadingWaitsForScene = false;
    return;
  }

  var settings = root.dataset;
  var fadeSeconds = Number(settings.fade || 0);
  var hidden = false;

  // Same maths as CanvasScaler, in CSS pixels; elements size themselves with var(--s).
  function layout() {
    var scale = Number(settings.scaleFactor || 1);
    if (settings.scaleMode === 'screen') {
      var x = window.innerWidth / Number(settings.refWidth);
      var y = window.innerHeight / Number(settings.refHeight);
      if (settings.matchMode === 'expand') {
        scale = Math.min(x, y);
      } else if (settings.matchMode === 'shrink') {
        scale = Math.max(x, y);
      } else {
        var match = Number(settings.match);
        scale = Math.pow(2, Math.log2(x) * (1 - match) + Math.log2(y) * match);
      }
    }
    root.style.setProperty('--s', scale);
  }

  window.setWebLoadingProgress = function (progress) {
    root.style.setProperty('--progress', progress);
    var percent = String(Math.round(progress * 100));
    var labels = root.querySelectorAll('.wl-progress');
    for (var i = 0; i < labels.length; i++) {
      labels[i].textContent = percent;
    }
  };

  window.hideWebLoadingScreen = function () {
    if (hidden) {
      return;
    }
    hidden = true;
    root.style.transition = 'opacity ' + fadeSeconds + 's';
    root.style.opacity = '0';
    root.style.pointerEvents = 'none';
    setTimeout(function () {
      root.style.display = 'none';
    }, fadeSeconds * 1000 + 50);
  };

  window.webLoadingWaitsForScene = settings.waitForHide === 'true';

  layout();
  window.setWebLoadingProgress(0);
  window.addEventListener('resize', layout);
})();
