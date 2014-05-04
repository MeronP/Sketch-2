var Sketch = PSD

//// Utility functions ////

isWebApp = function() {
	return window.navigator.standalone
}

setTimeSpeed = function(newSpeed) {
	Framer.config.timeSpeedFactor = newSpeed
}

refreshStatusBarTime = function() {
	currentDate = new Date()
	hours = currentDate.getHours()
	hours = hours % 12
	hours = hours ? hours : 12
	statusBarTime.html = hours+":"+(currentDate.getMinutes()<10?'0':'') + currentDate.getMinutes()+(currentDate.getHours()>=12? " PM" : " AM")
}

showAlert = function(title, message) {
	if (utils.isMobile() && utils.isTouch()) {
		alert(title+"\n\n"+message)
	} else {
		darkenScreen = new View({ x:0, y:0, height:1136, width: 640 })
		darkenScreen.style =  {
			"background-color": "rgba(0,0,0,0.25)",
			"opacity": "0"
		}

		//Fade in
		darkenScreen.animate({
			properties:{ opacity:1 },
			curve: "linear",
			time: 100
		})

		alertBox = new View({ x:50, y:418, width:540, height:280 })
		alertBox.superView = darkenScreen
		alertBox.style = {
		    "background-color": "rgba(255,255,255,0.85)",
		    "border-radius": "14px",
		    "color": "black",
		    "font": "28px Helvetica Neue",
		    "margin": "auto !important",
		    "text-align": "center"
		}

		titleView = new View({ x:0, y:40, height:"auto", width:540 })
		titleView.superView = alertBox
		titleView.html = title
		titleView.style = {
			"color": "black",
		    "font": "34px Helvetica Neue",
		    "font-weight": "500",
		    "text-align": "center"
		}

		messageView = new View({ x:0, y:104, height:"auto", width:"100%" })
		messageView.superView = alertBox
		messageView.html = message
		messageView.style = {
			"color": "black",
		    "font": "28px Helvetica Neue",
		    "font-weight": "300",
		    "line-height": "44px",
		    "margin-top": "-16px",
		    "padding": "0 38px",
		    "text-align": "center"
		}

		okButton = new View({ height:"auto", width:"100%"})
		okButton.superView = alertBox
		okButton.html = "OK"
		okButton.style = {
			"bottom": "0",
			"color": "#007AFF",
			"cursor": "pointer",
			"font-size": "34px",
			"font-weight": "500",
			"margin-bottom": "32px",
			"width": "100%"
		}

		okButton.on(pointerType, function() {
			fadeAnimation = new Animation({
				view:darkenScreen,
				properties:{opacity:0},
				curve: "linear",
				time: 100
			})
			fadeAnimation.on("end", function() {
				darkenScreen.destroy()
			})
			fadeAnimation.start()
		})
	}
}


//// Variables ////

//Important pointer type variable (click or touch)
pointerType = "click"

//Possible values: linear, ease-in, ease-out, cubic-bezier(0.25,0,0.75,1), spring(100,50,250)
animationCurve = "spring(100,20,1200)"

statusBarTime = null


//// Custom Functions, actions ////

showSecondScreen = function() {
	Sketch.Second_Screen.animate({
    	properties: { y: Sketch.Status_Bar.height },
    	curve: animationCurve
  	})
}

hideSecondScreen = function() {
	Sketch.Second_Screen.animate({
    	properties: { y: Sketch.Main_Screen.height },
    	curve: animationCurve
  	})
}

Sketch.Button.on(pointerType, function() {
	showSecondScreen()
})

Sketch.Back_Button.on(pointerType, function() {
	hideSecondScreen()
})

Sketch.First_Tab.on(pointerType, function() {
	showAlert("First tab pressed", "Proin quis tortor orci. Etiam at risus et justo dignissim congue.")
})


start = function() {
	//Clip everything to iPhone screen, setup view hierarchy
	iPhoneScreen = new View({ x:0, y:0, width:640, height:1136 })
	iPhoneScreen.style.overflow = "hidden"
	iPhoneScreen.style.background = "white"

	Sketch.Status_Bar.superView = iPhoneScreen
	Sketch.Main_Screen.superView = iPhoneScreen
	Sketch.Second_Screen.superView = iPhoneScreen

	Sketch.Status_Bar.placeBefore(Sketch.Main_Screen)
	Sketch.Second_Screen.placeBefore(Sketch.Main_Screen)

	Sketch.Nav_Bar.superView = Sketch.Content
	Sketch.Tab_Bar.superView = Sketch.Content

	Sketch.Second_Nav_Bar.superView = Sketch.Second_Content
	Sketch.Second_Tab_Bar.superView = Sketch.Second_Content


	if (utils.isTouch()) {
		pointerType = "touchstart"
	}


	// Don't show status bar for web apps, touchscreen mobiles
	if (isWebApp() || (utils.isMobile() && utils.isTouch())) {
		Sketch.Status_Bar.style.display = "none"
		Sketch["Content"].y -= 40
	} else {
		//Setup time in status bar
		statusBarTime = new View({ x:268, y:4, width:115, height:34 })
		statusBarTime.style = {
		    "background-color": "transparent",
		    "color": "black",
		    "font": "26px Helvetica Neue",
		    "text-align": "center"
		}
		refreshStatusBarTime()
		utils.interval(1000,refreshStatusBarTime)
	}


	Sketch.Second_Screen.x  = 0
	Sketch.Second_Screen.y = Sketch.Main_Screen.height
}


//// Page load/app start ////
start()