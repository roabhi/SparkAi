require('dotenv').config()
import { Mistral } from '@mistralai/mistralai'
import {
  ChatCompletionRequest,
  ChatCompletionResponse,
} from '@mistralai/mistralai/models/components'

import { revealStringByChar } from './utils/utils.main'

const apiKey = process.env.MISTRAL_API_KEY || ''
const client = new Mistral({ apiKey: apiKey })
const myOutputNode = document.getElementById('output') as HTMLElement

/**
 * ? Mistral Options
 * ? client.chat.complete --> Gives you a full anser at once
 * ? client.chat.stream --> Gives you an aswer sliced by tokens
 */

const outputResponseFromAi = (_output: string) => {
    revealStringByChar(_output, myOutputNode, 5)
  },
  processAiResponse = async (_prompt: string) => {
    const myRequest: ChatCompletionRequest = {
      model: 'pixtral-12b-2409',
      messages: [
        {
          role: 'user',
          content: _prompt,
        },
        {
          role: 'system',
          content:
            'Try to be as concise as possible with no more than 100 words per message. Add a little of sarcasm or irony when possible',
        },
      ],
      temperature: 0.4,
    }

    // ? for complete answers

    // await client.chat
    //   .complete(myRequest)
    //   .then((_res: ChatCompletionResponse) => {
    //     const answers = _res.choices

    //     if (answers && answers != undefined) {
    //       // console.log(answers[0].message.content)
    //       outputResponseFromAi(answers[0].message.content!)
    //     } else {
    //       outputResponseFromAi('Error on your request')
    //     }
    //   })

    // ? for stream answers

    const result = await client.chat.stream({
      model: 'mistral-small-latest',
      messages: [
        { role: 'user', content: _prompt },
        {
          role: 'system',
          content:
            'Try to be as concise as possible with no more than 100 words per message. Add a little of sarcasm or irony when possible',
        },
      ],
      temperature: 0.5,
    })

    for await (const chunk of result) {
      const streamText = chunk.data.choices[0].delta.content
      // console.log(streamText)
      myOutputNode.textContent = myOutputNode.textContent + streamText!
    }
  },
  init = (e) => {
    document.removeEventListener('DOMContentLoaded', init, false)

    const prompt: string = 'Which is the best Spanish food?'

    processAiResponse(prompt)
  }

document.addEventListener('DOMContentLoaded', init, false)
