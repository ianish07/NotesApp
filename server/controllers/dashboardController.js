const Note = require('../models/Notes');
const mongoose = require('mongoose');

// Get Dashboard

exports.dashboard = async (req, res) => {

    let perPage  = 12;
    let page = req.query.page || 1;

    const locals = {
        title: "Dashboard",
        description: "Nodejs notes App"
    };

    try{

        const notes = await Note.aggregate([
            //sorting with newest 1st
            {
                $sort: {
                    updatedAt: -1
                }
            },
            //match data with curr user
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.id)
                }
            },
            {
                $project: {
                    //show title with max 30 char
                    title: { $substr: ["$title", 0, 30] },
                    //show body with max 100 char
                    body: { $substr: ["$body", 0, 100] },
                },
            }
        ])
        .skip(perPage * page - perPage)
        .limit(perPage)     //limit how many notes u wanna display per page
        .exec()

        const count = await Note.count();

        res.render('dashboard/index', {
            userName: req.user.firstName,
            notes,
            locals,
            layout: '../views/layouts/dashboard',
            current: page,
            pages: Math.ceil(count / perPage)
        });

    } catch (error) {
        console.log(error);
    }
};

/**
 * GET / View specific note
 */

exports.dashboardViewNote = async(req, res) => {
    const note = await Note.findById({ _id: req.params.id })
    .where({ user: req.user.id }).lean();

    if(note) {
        res.render("dashboard/view-note", {
            noteID: req.params.id,
            note,
            layout: "../views/layouts/dashboard"
        });
    } else {
        res.send("Something went wrong!");
    }
};

/**
 * PUT / Update specific note
 */

exports.dashboardUpdateNote = async(req, res) => {
    try {

        await Note.findByIdAndUpdate(
            { _id: req.params.id },
            {
                title: req.body.title,
                body: req.body.body,
                updatedAt: Date.now()
            }
        ).where({user: req.user.id });
        
        res.redirect("/dashboard");

    } catch (error) {
        console.log(error);
    }
};

/**
 * DELETE/ delete a note
 */

exports.dashboardDeleteNote = async (req, res) => {
    try {
        await Note.deleteOne(
            { _id: req.params.id }
        ).where({ user: req.user.id });

        res.redirect("/dashboard");

    } catch (error) {
        console.log(error);
    }
};

/**
 * GET / Add Notes
 */

exports.dashboardAddNote = async (req, res) => {
    res.render('dashboard/add', {
        layout: "../views/layouts/dashboard"
    });
};

/**
 *  POST / Add Notes
 */

exports.dashboardAddNoteSubmit = async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Note.create(req.body);
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
};



