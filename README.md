<link rel="stylesheet" href="/Resources/styles.css">

# FitsGo App

## Introduction
This is a mobile application that aims to help get people to start exercising. This App is a cross-platform application which runs both of Android and IOS. It is built using Facebook React-Native and Google Firebase real-time database. This app provides a set of target locations that the user can run/walk/bike. Only locations in your current region will be displayed to you. Routes to these locations are shown to the user when the user selects the marker and if the user chooses to go to these locations, the distance, calories burnt, the time it took to travel there and the marker badge will be added to their record. This is done so the user can keep track of their exercise journey through this application. The user can also adjust and customize their profile which includes their personnel details such as names, weight and date of birth.

_(Future update) -_ Friends connectivity, connect with your friends to show off or encourage your friends by showing your exercising records and accomplishment. Also weekly challenges!!

<img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/showcase.gif' width='442' height='922'>

## How to use it

### Permission Requirements
This application will require some user permmsions to be granted in order for the app to be fully functional. Permission that are required are as follow
- Location
- File access
- Camera access
- Third party app install

    <img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/locationpermit.jpg'>
    <img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/filespermit.jpg'>
    <img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/camerapermit.jpg'>
    <img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/install01.jpg'>
    <img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/install02.jpg'>

### Privacy Policy
<img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/privacypolicy.jpg'>
<!-- ![FitsGo](https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/privacypolicy.jpg) -->

### Signup/Sign in
The login page will be the first page that you will encounter if it is your first time launching the app or you have not remained sign in from a previous session. This page will prompt you to enter in your email and password that you used to sign up initially. There is also a section to reset your password using your registered email. This will be sent you an email which will allow you to reset your password. You can also sign up to the application using the signup button. This will prompt you with some signup question such as your name, email and password etc. You can also choose to sign up/sign in using a preexisting Google account. You can do this by clicking the 'sign in with Google' button which will then prompt you to enter your Google account credentials. This application is strictly authorized usage only;y which means that you will have to sign in using Google or a registered email to access the content of the application. 

<img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/signin.jpg'>
<img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/signup.jpg'>
<img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/resetpwd.jpg'>
<img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/updatepwd.jpg'>

### Using the map
Once you have sign in to the application. You will be greeted with a map which is the main page of the app. From this map, you will be able to see all the possible exercise location that you can run to within your region. The point of interests is only displayed within your current region. If you which to see points in another region, you will have to travel to that particular region to view them. You can now choose to select what markers you which to travel to. When the markers are selected, the most efficient route based on the selected mode of travelling (run/walk/bike), which can be selected at the bottom of the screen, will be displayed to you on the map. You can choose to follow the guided route or carve your own path to your selected destination. Once you are ready to start your exercise, click the play button located at the bottom section of the app and begin your exercise. Once you start to move, another line will be drawn onto the maps which is your trail to the selected location. Once you have reached your selected location, press the pause button then the stop button to add your current exercise session to your record. If your location is within the boundaries of the selected marker, you will then collect that marker and the markers badge will be added to your record. 

<img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/mainmap.jpg'>
<img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/choosebadge.jpg'>
<img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/workingout.jpg'>
<img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/pauseworkout.jpg'>

### Profile page
This page of the app will display information about your profile details. This includes your name (first and last), weight (in kg) and date of birth. This page will be what you first see if you first sign up to the app or sign in with Google for the first time. This is to ensure that the profile for the user is set up before proceeding. You can also access your profile by google to the side navigation bar and selecting profile. Here you can make changes to your profile and save it by clicking the save button. 

<img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/profile.jpg'>
<img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/editicon.jpg'>

### Record Page
This page can be accessed by going to the side navigation bar and selecting records. This will house all your exercise record from all the exercise session. This will include your time, calories burnt per session and the marker badgers you have collected. 

_(Future update) -_ The record page will be what your friends will be able to view. This will also display all the weekly challenges you have completed 

<img src='https://gitlab.op-bit.nz/BIT/Project/Mobile-Development/excercise-app/raw/clean-up/Resources/records.jpg'>
