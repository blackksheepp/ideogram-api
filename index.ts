import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

import fs from 'fs-extra';
import path from 'path';

const refreshFile = path.join(__dirname, 'refresh.txt');

dotenv.config();

if (!process.env.REFRESH_TOKEN) {
    throw new Error('REFRESH_TOKEN is not set. Please set it in .env');
}

if (!process.env.COOKIES) {
    throw new Error('COOKIES is not set. Please set it in .env');
}


const app = express();
const PORT = process.env.PORT || 3000;

var USER_ID: string;
var ACCESS_TOKEN: string;

const Api = "https://ideogram.ai/api/images";
const Payload = { "aspect_ratio": "1:1", "prompt": "", "raw_or_fun": "raw", "style": "photo", "user_id": "", "model_version": "V_0_3", "use_autoprompt_option": "AUTO" };
const BaseHeaders = {
    "Host": "ideogram.ai",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "Referer": "https://ideogram.ai/u/test1014/generated",
    "Content-Type": "application/json",
    "Authorization": "",
    "Alt-Used": "ideogram.ai",
    "Connection": "keep-alive",
    "Cookie": process.env.COOKIES,
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "TE": "trailers"
}

const TokenHeaders = {
    "User-Agent": "Mozilla / 5.0(Windows NT 10.0; Win64; x64; rv: 125.0) Gecko / 20100101 Firefox / 125.0",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "Referer": "https://ideogram.ai/",
    "X-Client-Version": "Firefox/JsCore/10.9.0/FirebaseCore-web",
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": "478",
    "Origin": "https://ideogram.ai",
    "Connection": "keep-alive",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
}

const refreshToken = async () => {
    const refreshUrl = "https://securetoken.googleapis.com/v1/token?key=AIzaSyBwq4bRiOapXYaKE-0Y46vLAw1-fzALq7Y";
    const refreshPayload = {
        "grant_type": "refresh_token",
        "refresh_token": ""
    }

    if (fs.existsSync(refreshFile)) {
        refreshPayload["refresh_token"] = fs.readFileSync(refreshFile, 'utf-8')
    } else {
        refreshPayload["refresh_token"] = process.env.REFRESH_TOKEN!
    }

    const res = await axios.post(refreshUrl, refreshPayload, {
        headers: TokenHeaders
    })

    if (res && res.data) {
        USER_ID = res.data.user_id;
        ACCESS_TOKEN = res.data.access_token;
        if (!fs.existsSync(refreshFile)) {
            fs.writeFileSync(refreshFile, res.data.refresh_token)
        }
    }
}



const makeRequest = async (prompt: string) => {
    const requestUrl = Api + "/sample";
    if (!USER_ID || !ACCESS_TOKEN) {
        await refreshToken();
        Payload["user_id"] = USER_ID;
        BaseHeaders["Authorization"] = "Bearer " + ACCESS_TOKEN;
    }

    const requestPayload = Payload;
    requestPayload["prompt"] = prompt;

    const res = await axios.post(requestUrl, requestPayload, {
        headers: BaseHeaders
    })

    if (res && res.data) {
        if (res.data.request_id) {
            return res.data.request_id as string;
        }
    }
}

const generateImages = async (prompt: string) => {
    const request_id = await makeRequest(prompt);
    if (request_id) {
        const imageUrl = Api + "/retrieve_metadata_request_id/" + request_id;

        var res = await axios.get(imageUrl, {
            headers: BaseHeaders
        })

        if (res && res.data) {
            while (!res.data.is_completed) {
                res = await axios.get(imageUrl, {
                    headers: BaseHeaders
                })
            }

            return res.data.responses.map((r: any) => Api + "/direct/" + r.response_id)
        }
        
    }

}

app.get('/', (req: Request, res: Response) => {
    const prompt = req.query.prompt as string;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt parameter is missing' });
    }

    generateImages(prompt)
        .then(images => {
            if (images) {
                res.json(images);
            } else {
                res.status(404).json({ error: 'Failed to generate images.' });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
