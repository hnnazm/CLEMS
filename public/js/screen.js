var iOS = navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)

if (iOS) 
document.head.querySelector('meta[name="viewport"]').content = "width=device-width, initial-scale=1, maximum-scale=1"
else 
document.head.querySelector('meta[name="viewport"]').content = "width=device-width, initial-scale=1"

// Handle the browser frame that affect viewport
;(function viewport_adjustment() {
  let vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
})()

window.addEventListener('resize', () => viewport_adjustment())
