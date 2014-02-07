//// Utility functions ////

isWebApp = function() {
	return window.navigator.standalone;
}

setTimeSpeed = function(newSpeed) {
	Framer.config.timeSpeedFactor = newSpeed
}

refreshStatusBarTime = function() {
	currentDate = new Date();
	hours = currentDate.getHours();
	hours = hours % 12;
	hours = hours ? hours : 12;
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
pointerType = "click";

//Possible values: linear, ease-in, ease-out, cubic-bezier(0.25,0,0.75,1), spring(100,50,250)
animationCurve = "spring(100,20,1200)"

statusBarTime = null


//// Custom Functions, actions ////

showSecondScreen = function() {
	PSD.Second_Screen.animate({
    	properties: { y: PSD.Status_Bar.height },
    	curve: animationCurve
  	})
}

hideSecondScreen = function() {
	PSD.Second_Screen.animate({
    	properties: { y: PSD.Main_Screen.height },
    	curve: animationCurve
  	})
}

PSD.Button.on(pointerType, function() {
	showSecondScreen()
})

PSD.Back_Button.on(pointerType, function() {
	hideSecondScreen()
})

PSD.First_Tab.on(pointerType, function() {
	showAlert("First tab pressed", "Proin quis tortor orci. Etiam at risus et justo dignissim congue.")
})


start = function() {
	//Clip everything to iPhone screen, setup view hierarchy
	iPhoneScreen = new View({ x:0, y:0, width:640, height:1136 })
	iPhoneScreen.style.overflow = "hidden"
	iPhoneScreen.style.background = "white"

	PSD.Status_Bar.superView = iPhoneScreen
	PSD.Main_Screen.superView = iPhoneScreen
	PSD.Second_Screen.superView = iPhoneScreen

	PSD.Status_Bar.placeBefore(PSD.Main_Screen)
	PSD.Second_Screen.placeBefore(PSD.Main_Screen)

	PSD.Nav_Bar.superView = PSD.Content
	PSD.Tab_Bar.superView = PSD.Content

	PSD.Second_Nav_Bar.superView = PSD.Second_Content
	PSD.Second_Tab_Bar.superView = PSD.Second_Content


	if (utils.isTouch()) {
		pointerType = "touchstart";
	}


	// Don't show status bar for web apps, touchscreen mobiles
	if (isWebApp() || (utils.isMobile() && utils.isTouch())) {
		PSD.Status_Bar.style.display = "none"
		PSD["Content"].y -= 40
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


	PSD.Second_Screen.x  = 0
	PSD.Second_Screen.y = PSD.Main_Screen.height
}


//// Page load/app start ////
start()