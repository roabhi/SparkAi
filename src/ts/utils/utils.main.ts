export const revealStringByChar = (
  _text: string,
  _node: HTMLElement,
  _speed: number
) => {
  let textArr = _text.slice(0, _text.length),
    counter = 0

  const timer = setInterval(() => {
    if (counter == 0) {
      if (_node.textContent!.length > 0) {
        _node.textContent = ''
        return
      }
    } // ? make sure textContent is null before trying to reveal new text
    if (counter < _text.length) {
      _node.textContent += textArr[counter]
      counter++
    } else {
      clearInterval(timer)
    }
  }, _speed)
}

export const getResponseCurrentNode = (): HTMLElement => {
  console.log('entro')

  const myOutputNode = document.getElementById('dialog-box') as HTMLElement

  const myResponses: HTMLCollectionBase = myOutputNode.querySelectorAll(
    'div.dialog.ai-response'
  )
  return myResponses[myResponses.length - 1] as HTMLElement
}
