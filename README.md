# Ideogram API (Unofficial)

#### This is an unoficial wrapper made for Ideogram. You can enter your account details and use this api to generate images from anywhere you want.

<br>
<hr>
<br>

## How to run?
- <b>Step 1.</b> Rename "edit.env" to ".env" and fill the data as shown in steps below.
- <b>Step 2.</b> To Get "REFRESH_TOKEN" 
  - Open https://ideogram.ai/ -> Login -> Go to your profile page.
  - Open Inspect Tab -> Go to Networks Section -> Search "token" -> Go to Requests Tab -> Copy the highlighted text -> Paste into "REFRESH_TOKEN"
   ![](https://images2.imgbox.com/ea/75/3lNlkjJT_o.png)
- <b>Step 3.</b> To Get "COOKIES" 
  - Open https://ideogram.ai/ -> Login -> Go to your profile page.
  - Open Inspect Tab -> Go to Networks Section -> Search "api/n" -> Go to Headers Tab -> Copy the highlighted text -> Paste into "COOKIES"
   ![](https://images2.imgbox.com/e3/0b/TwXJl6tj_o.png)
- <b>Step 4.</b> Set PORT (optional) 
- <b>Step 5.</b> Run `npm i` 
- <b>Step 5.</b> Run `npm run dev` 

<br>
<hr>
<br>

## How to use?
- Just make request at `{your_host}:{port}/?prompt={prompt}`
  - example: `http://localhost:3000/?prompt=cat with a hat`
  - response:  [
    <br>"https://ideogram.ai/api/images/direct/C3LH6Ty7Tt2WvK3f4YLUfQ",
    <br>"https://ideogram.ai/api/images/direct/GbGf-Qw-SUWPQvc6F0mogQ",
    <br>"https://ideogram.ai/api/images/direct/K0W1AtJOTB-CQ58o8ei8hQ",
    <br>"https://ideogram.ai/api/images/direct/O-iv5bjJQhmmB0cQvbQbzw"
  <br>]
<br>
<hr>


