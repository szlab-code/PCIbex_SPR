PennController.ResetPrefix(null); // Shorten command names (keep this line here))

CheckPreloaded()

var showProgressBar = false

// DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// First show instructions, then experiment trials, send results and show end screen
Sequence("welcome", "instruction", "before_start", "experiment", SendResults(), "end")

// This is run at the beginning of each trial
Header(
    // Declare a global Var element "ID" in which we will store the participant's ID
    newVar("ID").global()
)
.log( "id" , getVar("ID") ) // Add the ID to all trials' results lines

// Instructions
newTrial("welcome",
    newText("<p>欢迎参加该阅读实验，该部分实验耗时约15分钟。</p><p>在本实验中，您将会阅读一系列句子。</p><p>阅读完句子后，您需要回答和句子内容有关的问题。</p><p>请核对下方您的Prolific ID是否正确，然后点击<b>开始</b>按钮，开始练习。</p>")
        .center()
        .css("margin", "1.25em")
        .print("center at 50vw", "bottom at 50vh")
    ,
    newTextInput("inputID", GetURLParameter("PROLIFIC_PID"))
        .center()
        .css({"margin": "1.25em", "font-size": "x-large"})    // Add a 1em margin around this element
        .print("center at 50vw", "middle at 50vh")
    ,
    newButton("开始")
        .center()
        .css("margin", "1.25em")
        .print("center at 50vw", "top at 50vh")
        // Only validate a click on Start when inputID has been filled
        .wait( getTextInput("inputID").testNot.text("") )
    ,
    // Store the text from inputID into the Var element
    getVar("ID").set( getTextInput("inputID") )
    ,
    fullscreen()
)

// First, practice trial
Template(GetTable("practice.csv")
    .setGroupColumn("List")
    .filter("List", /1/)
    , 
    row =>
    newTrial( "instruction",
        // Automatically print all Text and Button elements, centered
        newText("instruction_1", "<p>请点击<b>开始阅读</b>，逐词阅读句子。</p><p>当您阅读完一个词后，请按<b>空格键</b>，下一个词会自动出现。</p>")
            .center()
            .css("margin", "1em")
            .print("center at 50vw", "bottom at 50vh")
        ,
        newButton("开始阅读")
            .center()
            .css("margin", "1em")
            .print("center at 50vw", "top at 50vh")
            .wait()
            .remove()
        ,
        getText("instruction_1")
            .remove()
        ,
        newText("fixation", "+")
            .css("font-size", "48pt")
            .print("center at 50vw", "middle at 50vh")
        ,
        newTimer("sentence_start", 800)
            .start()
            .wait()
        ,
        getText("fixation")
            .remove()
        ,
        // We use the native-Ibex "DashedSentence" controller
        // Documentation at: https://github.com/addrummond/ibex/blob/master/docs/manual.md#dashedsentence
        newController("DashedSentence", {
            s: row.Sentence})
            .print("center at 50vw", "middle at 50vh")
            .log()      // Make sure to log the participant's progress
            .wait()
            .remove()
        ,
        newText("instruction_2", "当您阅读完句子后，请点击<b>回答问题</b>，并根据句子内容回答问题。")
            .center()
            .css("margin", "1em")
            .print("center at 50vw", "bottom at 50vh")
        ,
        newButton("回答问题")
            .center()
            .css("margin", "1em")
            .print("center at 50vw", "top at 50vh")
            .wait()
            .remove()
        ,
        getText("instruction_2")
            .remove()
        ,
        newController("Question", {
            q: row.Question, 
            as: [row.Correct, row.Wrong],
            instructions: "请根据句子内容，点击并选择正确选项。",
            hasCorrect: true, 
            showNumbers: false
        })
            .print("center at 50vw", "middle at 50vh")
            .log()      // Make sure to log the participant's progress
            .wait()
            .remove()
    )
    .log("item", row.Item)
    .log("list", row.List)
    .log("order", row.Order)
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
    newText("<p>您已完成练习。</p><p>当您准备好后，请点击<b>开始</b>按钮，参加正式实验。</p><p>请注意，在正式实验中，将不会再出现任何和操作有关的提示。</p>")
        .center()
        .css("margin", "1em")
        .print("center at 50vw", "bottom at 50vh")
    ,
    newButton("开始")
        .center()
        .css("margin", "1em")
        .print("center at 50vw", "top at 50vh")
        .wait()
)

// Third, formal experiment trial
Template(GetTable("stimuli.csv")
    .setGroupColumn("List")
    .filter("List", /1/)
    , 
    row =>
    newTrial( "experiment",
        // Automatically print all Text and Button elements, centered
        newText("fixation", "+")
            .css("font-size", "48pt")
            .print("center at 50vw", "middle at 50vh")
        ,
        newTimer("sentence_start", 800)
            .start()
            .wait()
        ,
        getText("fixation")
            .remove()
        ,
        newController("DashedSentence", {
            s: row.Sentence})
            .print("center at 50vw", "middle at 50vh")
            .log()
            .wait()
            .remove()
        ,
        newButton("回答问题")
            .print("center at 50vw", "middle at 50vh")
            .wait()
            .remove()
        ,
        newController("Question", {
            q: row.Question, 
            as: [row.Correct, row.Wrong],
            hasCorrect: true, 
            showNumbers: false
        })
            .print("center at 50vw", "middle at 50vh")
            .log()      // Make sure to log the participant's progress
            .wait()
            .remove()
    )
    .log("item", row.Item)
    .log("list", row.List)
    .log("order", row.Order)
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
    defaultText.center().print("center at 50vw", "middle at 50vh")
    ,
    exitFullscreen()
    ,
    newText("<p>非常感谢！您已完成该部分实验。</p><p><a href='https://lhq-blclab.org/student/experiment_load_login/?questionnaire_ID=mep39gtd&PROLIFIC_PID="+GetURLParameter("PROLIFIC_PID")+"' target='_blank'>请点击此处</a>，进入实验第二部分，填写一份语言背景调查问卷。</p><p>填写调查问卷时，请在<b>被试编号</b>一栏填入您的Prolific ID。</p><p>您的Prolific ID是 <b>"+GetURLParameter("PROLIFIC_PID")+"</b>。</p>")
    ,
    // Trick: stay on this trial forever (until tab is closed)
    newButton().wait()
)
