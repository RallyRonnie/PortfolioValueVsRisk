rally-value-risk
===============

![Alt text](https://raw.github.com/RallyRonnie/PortfolioValueVsRisk/master/deploy/screenshot.png)

##Overview

This is a Rally SDK app that measures risk vs value on certain types (think Strategy, Theme, Initiative, Enhancement, etc). You can click on each item in the key to toggle if the graph will show or not. When you hover over any graph item, you can see the actual risk and value numbers in addition to the size of the type. In addition, you can also print the graph and save the graph in a variety of formats (PNG, JPEG, PDF, SVG). 

##How to Use

If you want to start using the app immediately, create an Custom HTML app on your Rally dashboard. Then copy ValueRiskApp.html from the deploy folder into the HTML text area. That's it, it should be ready to use.

Or you can just click [here](https://raw.github.com/osulehria/rally-value-risk/master/deploy/ValueRiskApp.html) to find the file and copy it into the custom HTML app.

##Customize this App

This app includes a Rakefile with these tasks that will help you deploy the app in such a way that Rally will recognize your code:

Available tasks are:

    rake combine       # Parses mashup HTML and replaces stylesheet includes with the referenced CSS content and JS includes with the JS itself to create Rally-ready HTML
    rake default       # Default task
    rake deploy        # Combine and run jslint
    rake deployall     # Build all apps and copy the built output to lam
    rake jslint        # Runs JSLint on all component JavaScript files
    rake new[appName]  # Create a new app

If you want to include more Javascript files, simply add them to the ValueRisk.template.html within the header. It's the same with CSS files, just add the stylesheet name to the header in the HTML template file.

##License

rally-value-risk is released under the MIT license. See the file [LICENSE](https://raw.github.com/osulehria/rally-value-risk/master/LICENSE) for the full text.
