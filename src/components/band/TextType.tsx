'use client'

import { useState, useEffect, useRef, createElement, useCallback } from 'react'

const defaultChars = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '!',
  '#',
  '$',
  '%',
  '^',
  '&',
  '*',
  '(',
  ')',
  '-',
  '_',
  '+',
  '=',
  '[',
  ']',
  '{',
  '}',
  '|',
  ';',
  ':',
  '<',
  '>',
  ',',
  '.',
  '?',
]

const defaultSpeed = [50, 100]
const defaultColor = ['#aaa', '#fff']

const TextType = ({
  as: Component = 'div',
  text,
  chars = defaultChars,
  speed = defaultSpeed,
  color = defaultColor,
  className,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState(text)
  const [isTyping, setIsTyping] = useState(true)
  const intervalRef = useRef(null)
  const containerRef = useRef(null)

  const getRandomChar = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * chars.length)
    return chars[randomIndex]
  }, [chars])

  const getRandomSpeed = useCallback(() => {
    const [min, max] = speed
    return Math.random() * (max - min) + min
  }, [speed])

  const getCurrentTextColor = useCallback(() => {
    const [startColor, endColor] = color
    return isTyping ? startColor : endColor
  }, [color, isTyping])

  useEffect(() => {
    const targetText = text
    let currentIndex = 0

    const type = () => {
      const currentText = displayedText.split('')
      let isDone = true

      for (let i = 0; i < targetText.length; i++) {
        if (i < currentIndex) {
          currentText[i] = targetText[i]
        } else {
          currentText[i] = getRandomChar()
          isDone = false
        }
      }

      setDisplayedText(currentText.join(''))

      if (isDone) {
        clearInterval(intervalRef.current)
        setIsTyping(false)
      } else {
        currentIndex += 1 / (Math.random() * 2 + 1) // Randomize typing progress
      }
    }

    intervalRef.current = setInterval(type, getRandomSpeed())

    return () => clearInterval(intervalRef.current)
  }, [text, getRandomChar, getRandomSpeed])

  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(text) // Ensure final text is correct
    }
  }, [isTyping, text])

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `inline-block whitespace-pre-wrap tracking-tight ${className}`,
      ...props
    },
    <span className="inline" style={{ color: getCurrentTextColor() || 'inherit' }}>
      {displayedText}
    </span>,
  )
}

export default TextType
