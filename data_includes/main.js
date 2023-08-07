PennController.ResetPrefix(null); // Shorten command names (keep this line here))

// DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// First show instructions, then experiment trials, send results and show end screen
Sequence("instructions", "experiment", SendResults(), "end")

// This is run at the beginning of each trial
Header(
    // Declare a global Var element "ID" in which we will store the participant's ID
    newVar("ID").global()    
)
.log( "id" , getVar("ID") ) // Add the ID to all trials' results lines

// Instructions
newTrial("instruction",
    // Automatically print all Text and Button elements, centered
    defaultText.center().print()
    ,
    defaultButton.center().print()
    ,
    newText("欢迎参加该阅读实验。")
    ,
    newText("在该实验中，您将会阅读一系列句子。")
    ,
    newText("在阅读完句子后，您需要回答和句子内容有关的问题。")
    ,
    newText("请在下方输入您的ID，并点击<b>开始</b>按钮以开始实验。")
    ,
    newTextInput("inputID", "")
        .center()
        .css("margin","1em")    // Add a 1em margin around this element
        .print()
    ,
    newButton("Start")
        .center()
        .print()
        // Only validate a click on Start when inputID has been filled
        .wait( getTextInput("inputID").testNot.text("") )
    ,
    // Store the text from inputID into the Var element
    getVar("ID").set( getTextInput("inputID") )
)

// First, practice trial
newTrial( "experiment",
    // Automatically print all Text and Button elements, centered
    defaultText.center().print()
    ,
    defaultButton.center().print()
    ,
    newText("instructions", "Click on the button below to start reading. Click spacebar to proceed to the next word.")
        .print()
    ,
    newButton("Start reading")
        .print()
        .wait()
        .remove()
    ,
    getText("instructions")
        .remove()
    ,
    // We use the native-Ibex "DashedSentence" controller
    // Documentation at:   https://github.com/addrummond/ibex/blob/master/docs/manual.md#dashedsentence
    newController("DashedSentence", {s : "You have just begun reading the sentence you have just finished reading."})
        .print()
        .log()      // Make sure to log the participant's progress
        .wait()
        .remove()
    ,
    newButton("Next sentence please!")
        .print()
        .wait()
)

// Second, more concise experiment trial
Template("items.csv", row =>
    newTrial( "experiment",
    // Automatically print all Text and Button elements, centered
    defaultText.center().print()
    ,
    defaultButton.center().print()
    ,
    newController("DashedSentence", row.Sentence)
        .center()
        .print()
        .log()
        .wait()
        .remove()
    ,
    newButton("I'm done")
        .print()
        .wait()
    )
)


// Final screen
newTrial("end",
    newText("Thank you for your participation!")
        .center()
        .print()
    ,
    // This link a placeholder: replace it with a URL provided by your participant-pooling platform
    newText("<p><a href='https://www.pcibex.net/' target='_blank'>Click here to validate your submission</a></p>")
        .center()
        .print()
    ,
    // Trick: stay on this trial forever (until tab is closed)
    newButton().wait()
)
.setOption("countsForProgressBar",false)