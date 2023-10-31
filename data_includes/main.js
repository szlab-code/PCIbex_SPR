PennController.ResetPrefix(null); // Shorten command names (keep this line here))

CheckPreloaded()

var showProgressBar = false

DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// First show instructions, then experiment trials, send results and show end screen
Sequence("counter", "welcome", "instruction", "before_start", "experiment", SendResults(), "end", "questionnaire")

SetCounter("counter", "inc", 1)

// This is run at the beginning of each trial
Header(
    // Declare a global Var element "ID" in which we will store the participant's ID
    newVar("ID").global()
)
.log( "id" , getVar("ID") ) // Add the ID to all trials' results lines

// Instructions
newTrial("welcome",
    newText("<p>欢迎参加本研究！该研究分为两部分。</p><p>在该部分实验中，您将会阅读一系列句子，然后回答问题。</p><p>该部分实验耗时约15分钟。</p><p>请核对下方您的Prolific ID是否正确，然后点击<b>全屏开始</b>按钮，进行练习。</p>")
        .center()
        .css("margin", "1.25em")
        .print("center at 50vw", "bottom at 50vh")
    ,
    newTextInput("inputID", GetURLParameter("PROLIFIC_PID"))
        .center()
        .css({"margin": "1.25em", "font-size": "x-large"})    // Add a 1em margin around this element
        .print("center at 50vw", "middle at 50vh")
    ,
    newButton("全屏开始")
        .center()
        .css("margin", "1.5em")
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
    //.filter("List", /1/)
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
        newText("instruction_2", "接下来，请点击<b>回答问题</b>，根据刚刚句子的内容回答问题。")
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
            instructions: "请根据句子内容，点击正确选项。",
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
    newText("<p>您已完成练习。</p><p>当您准备好后，请点击<b>开始</b>按钮，参加正式实验。</p><p>请注意，在正式实验中，将<b>不会</b>再出现任何和操作有关的提示。</p>")
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
    //.filter("List", /1/)
    , 
    row =>
    newTrial( "experiment",
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


// End of self-paced reading
newTrial("end",
    defaultText.center().css("margin", "1em").print("center at 50vw", "bottom at 50vh")
    ,
    exitFullscreen()
    ,
    newText("<p>非常感谢！您已完成该部分实验。</p><p>请点击<b>阅读说明</b>按钮，阅读研究第二部分的说明。</p><p>请注意，只有当您<b>参加完第二部分研究后</b>，才能收到Prolific的报酬。</p>")
    ,
    newButton("阅读说明")
        .center()
        .css("margin", "1em")
        .print("center at 50vw", "top at 50vh")
        .wait()
)

// Instructions for LHQ 3.0
newTrial("questionnaire",
    defaultText.center().print()
    ,
    newText("在第二部分研究中，您需要填写一份语言背景调查问卷。")
    ,
    newText("在填写过程中，请注意以下事项：")
    ,
    newText("-- 问卷填写通常耗时30分钟。为避免遇到问题，请您在填写问卷时不要超过Prolific的时间限制。")        
    ,
    newText("-- 填写问卷时，请在<b>被试编号</b>一栏填入您的Prolific ID <b>"+GetURLParameter("PROLIFIC_PID")+"</b>。")        
    ,
    newText("-- 您可能会觉得部分问题难以回答（例如：“您于什么年龄开始通过在线游戏学习XX语言？”）；针对这类问题，请在文本框内填入<b>99</b>。")
    ,
    newText("-- 如果您自出生起就开始学习/使用某种语言，请在对应问题的文本框内填入<b>0</b>。")
    ,
    newText("-- 该问卷是基于英文翻译而成。如果您认为某些问题难以理解，可以<a href='https://lhq-blclab.org/pdfs/' target='_blank'>下载英文版问卷</a>，进行参考。")
    ,
    newText("-- 完成填写后，请务必点击<b>问卷页面</b>末尾的<b>提交</b>按钮；成功提交后，您会看到来自Prolific的提示。")        
    ,        
    newText("-- 在填写过程中，请不要关闭本网页，以便您可以随时回来阅读注意事项。")
    ,
    newText("当您准备好后，请点击<b>填写问卷</b>，开始填写问卷。")
    ,
    newButton("<a href='https://lhq-blclab.org/student/experiment_load_login/?questionnaire_ID=iyh92scp&PROLIFIC_PID="+GetURLParameter("PROLIFIC_PID")+"' target='_blank'>填写问卷</a>")
        .center()
        .print()
    ,
    // Trick: stay on this trial forever (until tab is closed)
    newButton().wait()
)