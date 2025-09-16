const Session = require("../models/Session");
const Question = require("../models/Question");
const { generateInterviewQuestions } = require("../services/aiService");

exports.createSession = async (req,res) =>{
     try{
        const {title, description, role, experience, topicToFocus, questions} = req.body;
        const userId = req.user._id;

        const session = await Session.create({
                user:userId,
                role: role || title || 'General',
                experience: experience || 'Entry Level',
                topicToFocus: topicToFocus || 'General Topics',
                description,
        });

        if (questions && Array.isArray(questions)) {
            const questionDocs = questions.map(q => ({
                session: session._id,
                question: q.question || q,
                answer: q.answer || "",
                isPinned: false,
            }));
            const createdQuestions = await Question.insertMany(questionDocs);
            session.questions.push(...createdQuestions.map(q => q._id));
            await session.save();
        }

        res.status(201).json({success:true,session});
     } catch(error){
        res.status(500).json({success:false,message:"Server Error"})
     }
};

exports.getMySessions = async(req,res) => {
    try{
        const sessions = await Session.find({user:req.user._id})
        .sort({createdAt:-1})
        .populate("questions");
        res.status(200).json({sessions})
    }catch(error){
        res.status(500).json({success:false,message:"Server Error   "});
    }
};

exports.getSessionById = async(req,res) => {
    try{
            const session = await Session.findById(req.params.id)
            .populate({
                path:"questions",
                options:{sort:{isPinned:-1,createdAt:1}},
            })
            .exec();

            if(!session){
                return res 
                .status(404)
                .json({success:false,message:"Session Not Found"});
            }
            res.status(200).json({success:true,session}); 
    }catch(error){
        res.status(500).json({success:false,message:"Server Error   "});
    }
};

exports.deleteSession = async(req,res) => {
     try{
           const session = await Session.findById(req.params.id);

           if(!session)
           {
            return res.status(404).json({message:"Session not found"})

           }

           if(session.user.toString() !== req.user.id){
            return res
            .status(401)
            .json({message:"Not authorized to delete this session"});
           }

           await Question.deleteMany({session:session._id});

           await session.deleteOne();

           res.status(200).json({message:"Session deleted successfully"})
    }catch(error){
        res.status(500).json({success:false,message:"Server Error   "});
    }
};

exports.aiGenerateMoreQuestions = async (req, res) => {
    try {
        const sessionId = req.params.id;
        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        if (session.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        // Generate more questions
        const questions = await generateInterviewQuestions(session.role, session.experience);

        // Create question documents
        const questionDocs = questions.map(q => ({
            session: sessionId,
            question: q,
            answer: "",
            isPinned: false,
        }));

        const createdQuestions = await Question.insertMany(questionDocs);

        // Add to session
        session.questions.push(...createdQuestions.map(q => q._id));
        await session.save();

        // Populate and return updated session
        const updatedSession = await Session.findById(sessionId).populate({
            path: "questions",
            options: { sort: { isPinned: -1, createdAt: 1 } },
        });

        res.status(200).json({ success: true, session: updatedSession });
    } catch (error) {
        console.error("Error generating more questions:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
