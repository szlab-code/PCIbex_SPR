PennController.ResetPrefix(null); // Shorten command names (keep this line here))

// DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// First show instructions, then experiment trials, send results and show end screen
Sequence("welcome", "instruction", "practice", "experiment", SendResults(), "end")

// This is run at the beginning of each trial
Header(
    // Declare a global Var element "ID" in which we will store the participant's ID
    newVar("ID").global()    
)
.log( "id" , getVar("ID") ) // Add the ID to all trials' results lines

// Instructions
newTrial("welcome",
    // Automatically print all Text and Button elements, centered
    defaultText.center().print().css("margin", "1em")
    ,
    defaultButton.center().print().css("margin", "1em")
    ,
    newText("欢迎参加该阅读实验。")
    ,
    newText("在该实验中，您将会阅读一系列句子。")
    ,
    newText("阅读完句子后，您需要回答和句子内容有关的问题。")
    ,
    newText("请在下方输入您的ID，并点击<b>开始</b>按钮以开始练习。")
    ,
    newTextInput("inputID", "")
        .center()
        .css("margin","1em")    // Add a 1em margin around this element
        .print()
    ,
    newButton("开始")
        .center()
        .print()
        // Only validate a click on Start when inputID has been filled
        .wait( getTextInput("inputID").testNot.text("") )
    ,
    // Store the text from inputID into the Var element
    getVar("ID").set( getTextInput("inputID") )
)

// First, practice trial
Template("practice.csv", row =>
    newTrial( "instruction",
        // Automatically print all Text and Button elements, centered
        defaultText.center().print().css("margin", "1em")
        ,
        defaultButton.center().print().css("margin", "1em")
        ,
        newText("instruction_1", "请点击<b>开始阅读</b>以开始逐词阅读句子。当您阅读完一个词后，请按<b>空格键</b>，下一个词会自动出现。")
            .print()
        ,
        newButton("开始阅读")
            .print()
            .wait()
            .remove()
        ,
        getText("instruction_1")
            .remove()
        ,
        // We use the native-Ibex "DashedSentence" controller
        // Documentation at: https://github.com/addrummond/ibex/blob/master/docs/manual.md#dashedsentence
        newController("DashedSentence", {
            s: row.Sentence})
            .center()
            .print()
            .log()      // Make sure to log the participant's progress
            .wait()
            .remove()
        ,
        newText("instruction_2", "当您阅读完句子后，请点击<b>回答问题</b>，并根据句子内容回答问题。")
            .print()
        ,
        newButton("回答问题")
            .print()
            .wait()
            .remove()
        ,
        getText("instruction_2")
            .remove()
        ,
        newController("Question", {
            q: row.Question, 
            as: [row.Correct, row.Wrong],
            instructions: "请根据刚刚阅读过的句子内容，判断该陈述正确或错误，并点击对应的选项。",
            hasCorrect: true, 
            showNumbers: false
        })
            .center()
            .print()
            .log()      // Make sure to log the participant's progress
            .wait()
            .remove()
    )
    .log("item", row.Item)
    .log("list", row.List)
    .log("sentence", row.Sentence)
    .log("qType", row.QuestionType)
    .log("correctAnswer", row.Correct)
    .log("wrongAnswer", row.Wrong)
    .log("VP", row.VP)
    .log("lexicalAsp", row.LexicalAspect)
    .log("grammaticalAsp", row.GrammaticalAspect)    
)

// Second, inform of the formal experiment
newTrial("before_start",
    // Automatically print all Text and Button elements, centered
    defaultText.center().print().css("margin", "1em")
    ,
    defaultButton.center().print().css("margin", "1em")
    ,
    newText("您已完成练习。")
    ,
    newText("当您准备好后，请点击<b>开始</b>按钮，以开始正式实验。")
    ,
    newText("请注意，在正式实验中，将不再会出现任何和操作有关的提示。")
    ,
    newButton("开始")
        .center()
        .print()
        .wait()
)

// Third, formal experiment trial
Template("stimuli.csv", row =>
    newTrial( "experiment",
        // Automatically print all Text and Button elements, centered
        defaultText.center().print().css("margin", "1em")
        ,
        defaultButton.center().print().css("margin", "1em")
        ,
        newController("DashedSentence", {
            s: row.Sentence})
            .center()
            .print()
            .log()
            .wait()
            .remove()
        ,
        newButton("回答问题")
            .print()
            .wait()
            .remove()
        ,
        newController("Question", {
            q: row.Question, 
            as: [row.Correct, row.Wrong],
            hasCorrect: true, 
            showNumbers: false
        })
            .center()
            .print()
            .log()      // Make sure to log the participant's progress
            .wait()
            .remove()
    )
    .log("item", row.Item)
    .log("list", row.List)
    .log("sentence", row.Sentence)
    .log("qType", row.QuestionType)
    .log("correctAnswer", row.Correct)
    .log("wrongAnswer", row.Wrong)
    .log("VP", row.VP)
    .log("lexicalAsp", row.LexicalAspect)
    .log("grammaticalAsp", row.GrammaticalAspect)
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