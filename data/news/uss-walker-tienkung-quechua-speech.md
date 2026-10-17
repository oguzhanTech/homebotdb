---
title: A campus robot in Peru speaks Quechua. Replies take 6 seconds.
slug: uss-walker-tienkung-quechua-speech
authorId: chuck-steward
summary: Universidad Señor de Sipán ran Southern Quechua speech on a UBTech Walker Tienkung. The voice is generated on the robot, and a sentence still takes about 6 seconds.
coverImage: /images/news/uss-walker-tienkung-quechuaa.jpg
coverImageCaption: "Walker Tienkung humanoids at Universidad Señor de Sipán in Chiclayo, July 6, 2026. The Quechua voice test used the same campus robots later. Photo: Observatorio USS."
sourceUrl: https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2026.1909076
createdAt: 2026-10-17T21:20:00Z
updatedAt: 2026-10-17T21:20:00Z
---

Universidad Señor de Sipán in Chiclayo, Peru, got a campus humanoid to speak Southern Quechua. On the robot's own chip, a sentence still takes about 6 seconds.

The [paper](https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2026.1909076) ran in Frontiers in Robotics and AI on September 30, 2026. The body is a UBTech Walker Tienkung, a research humanoid the university had already put on campus. Southern Quechua, in the Cusco-Puno dialect, belongs to the largest indigenous language family in the Americas. More than 10 million people speak some variety of Quechua, across Peru, Bolivia, Ecuador, Colombia, and Argentina. Talking robots almost never do.

![Walker Tienkung humanoids at the Chiclayo campus on July 6, 2026. Photo: Observatorio USS.](/images/news/uss-walker-tienkung-quechua.jpg)

## They borrowed Spanish to teach a new language

The team started from XTTS-v2, software that already reads text aloud in 16 languages. Quechua was not one of them. They sent Quechua writing through the Spanish step that turns letters into sounds, because the alphabets overlap, then trained on 22,727 checked recordings. That is about 30.5 hours from 77 speakers, released for anyone to use. A short test line was *allillanchu*, a one-word hello. Longer lines pack tense and person into a single word, which is how Quechua works.

## Fast enough to finish the file, slow for a hello

A big graphics chip made a test line in about 2.0 seconds. The chip inside the Walker Tienkung, an NVIDIA Jetson, took about 5.9 seconds, with no cloud server in the loop. In both cases the sound file was ready before that sound would have finished playing. The authors call that real time. A person waiting on a greeting does not. The paper says a natural pause in conversation is closer to a third of a second.

Making the model smaller, and connecting it to the robot's conversation software, is the next step. Those pieces are written down. They were not part of this experiment. A store of pre-made greetings could hide the delay later.

## The checker spoke the wrong language

They also ran the audio through Whisper, a common speech-to-text tool. Whisper has no Quechua setting. It filed the lines under other languages, and its word-error score was 147 percent. Above 100 percent means the tool inserted words that were not there. *allillanchu* came back as "ali yancun," close enough to show the sounds are not random. Native speakers of this dialect have not scored the voice yet. The authors say that listening test is still ahead.

Walker Tienkung is not going into the HomeBotRadar catalog. The photo is from the university's July 6 showing, with the robots on support frames. This is campus research, not a robot you order for a house. The part that matters for home machines is narrower: a voice that stays on the robot, in a language most products skip. Companion robots we already track, such as ElliQ, still assume a language with a huge training set.
