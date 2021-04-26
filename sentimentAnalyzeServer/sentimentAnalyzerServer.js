const express = require('express');
const app = new express();
const dotenv = require('dotenv').config();

function getNLUInstance() {
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');
    let apikey = process.env.API_KEY
    let apiurl = process.env.API_URL
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: apikey,
        }),
        serviceUrl: apiurl,
    });
    return naturalLanguageUnderstanding
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    let naturalLanguageUnderstanding = getNLUInstance()
    const analyzeParams = {
        'url': req.query.text,
        'features': {
            'emotion': {
                'document': true
            }
        }
    }
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(analysisResults)
        })
        .catch(err => {
            console.log('error:', err)
        })

    //return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    let naturalLanguageUnderstanding = getNLUInstance()
    const analyzeParams = {
        'url': req.query.text,
        'features': {
            'sentiment': {
                'document': true
            }
        }
    }
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(analysisResults.result.sentiment.document.label)
        })
        .catch(err => {
            console.log('error:', err)
        })
    //return res.send("text sentiment for "+req.query.text);
});

app.get("/text/emotion", (req,res) => {
    let naturalLanguageUnderstanding = getNLUInstance()
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'emotion': {
                'document': true
            }
        }
    }
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            console.log(analysisResults.result.emotion.document.emotion.sadness)
            return res.send(analysisResults.result.emotion.document.emotion)
        })
        .catch(err => {
            console.log('error:', err)
        })
});

app.get("/text/sentiment", (req,res) => {
    let naturalLanguageUnderstanding = getNLUInstance()
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'sentiment': {
                'document': true
            }
        }
    }
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(analysisResults.result.sentiment.document.label)
        })
        .catch(err => {
            console.log('error:', err)
        })
    //return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

