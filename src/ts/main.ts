// ? Import Mistral Ai

import { Mistral } from '@mistralai/mistralai'
import {
  ChatCompletionRequest,
  ChatCompletionResponse,
} from '@mistralai/mistralai/models/components'

// ? Import credentials

import { apiKey } from './globals/globals.constants'

// ? Import utils funcs

import { revealStringByChar, getResponseCurrentNode } from './utils/utils.main'

// ? Import DOM references

import {
  myOutputNode,
  myForm,
  myInputField,
  mySendButton,
} from './globals/globals.dom'

// ? Init Mistral

const client = new Mistral({ apiKey: apiKey })

/**
 * ? Mistral Options
 * ? client.chat.complete --> Gives you a full anser at once
 * ? client.chat.stream --> Gives you an aswer sliced by tokens
 */

const insertDomDialog = (_content: string, _type: string) => {
    const myDialogNode: HTMLDivElement = document.createElement('div')
    const myDialogFirstChildDiv: HTMLDivElement = document.createElement('div')
    const myDialogLastChildNode: HTMLDivElement = document.createElement('div')

    const myDialogContent: HTMLParagraphElement = document.createElement('p')

    myDialogContent.textContent = _content

    // ? _type MUST be query or ai-response for this to work
    myDialogNode.classList.add('dialog', `${_type}`)

    myDialogLastChildNode.appendChild(myDialogContent)

    myDialogNode.appendChild(myDialogFirstChildDiv)
    myDialogNode.appendChild(myDialogLastChildNode)

    myOutputNode.appendChild(myDialogNode)
  },
  outputResponseFromAi = (_output: string) => {
    const myCurrentResponse: HTMLElement = getResponseCurrentNode()

    const myResponseContainer = myCurrentResponse.querySelector(
      'p'
    ) as HTMLElement

    revealStringByChar(_output, myResponseContainer, 5)
  },
  processAiResponse = async (_prompt: string) => {
    const myRequest: ChatCompletionRequest = {
      model: 'open-mixtral-8x22b',
      messages: [
        {
          role: 'user',
          content: _prompt,
        },
        {
          role: 'system',
          content:
            'Try to be as concise as possible with no more than 200 words per message.',
        },
      ],
      temperature: 0.4,
    }

    insertDomDialog('...', 'ai-response')

    // ? for complete answers

    await client.chat
      .complete(myRequest)
      .then((_res: ChatCompletionResponse) => {
        // ? Reset form input

        myInputField.value = ''
        mySendButton.disabled = false

        const answers = _res.choices

        if (answers && answers != undefined) {
          // console.log(answers[0].message.content)
          outputResponseFromAi(answers[0].message.content!)
        } else {
          outputResponseFromAi('Error on your request')
        }
      })
  },
  init = (e) => {
    document.removeEventListener('DOMContentLoaded', init, false)

    myForm.addEventListener('submit', (e) => {
      e.preventDefault()

      const myTarget = e.target as HTMLFormElement
      const myInput = myTarget.querySelector('input') as HTMLInputElement
      const prompt: string = myInput.value

      insertDomDialog(prompt, 'query')

      mySendButton.disabled = true

      processAiResponse(prompt)
    })
  }

document.addEventListener('DOMContentLoaded', init, false)
