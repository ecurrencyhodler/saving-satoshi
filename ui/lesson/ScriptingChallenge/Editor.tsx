'use client'

import clsx from 'clsx'

import MonacoEditor from '@monaco-editor/react'

import { monacoOptions } from './config'
import { monaco } from 'react-monaco-editor'
import { useState } from 'react'
import { Loader } from 'shared'
import { LessonView } from 'types'
import { useLessonContext } from 'ui'
import { useMediaQuery } from 'hooks'

export default function Editor({
  language,
  value,

  onChange,
  onValidate,
}: {
  language: string
  value?: string
  onChange?: (value: string) => void
  onValidate?: (value: monaco.editor.IMarker[]) => void
}) {
  const { activeView } = useLessonContext()
  const isActive = activeView === LessonView.Code
  const [loading, setLoading] = useState<boolean>(true)

  const handleBeforeMount = (monaco) => {
    monaco.editor.defineTheme('satoshi', {
      base: monacoOptions.theme,
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#00000000',
        'editor.lineHighlightBorder': '#00000000', // 4th channel is for transparency
      },
    })
  }

  const handleMount = (editor, monaco) => {
    monaco.editor.setTheme('satoshi')

    setLoading(false)
  }

  const isSmallScreen = useMediaQuery({ width: 767 })
  const headerHeight = isSmallScreen ? 63 : 70
  const languageTabsHeight = 40
  const statusBarHeight = 56
  const terminalHeight = 218
  const terminalTabsHeight = 40
  const mobileMenuHeight = 48

  const totalHeight = isSmallScreen
    ? headerHeight + mobileMenuHeight + languageTabsHeight + statusBarHeight
    : headerHeight +
      languageTabsHeight +
      statusBarHeight +
      terminalHeight +
      terminalTabsHeight

  return (
    <div
      className={clsx('relative grow font-mono text-sm text-white', {
        'hidden md:flex': !isActive,
        flex: isActive,
      })}
    >
      <MonacoEditor
        loading={<Loader className="h-10 w-10 text-white" />}
        width={isSmallScreen ? '100vw' : 'calc(100vw / 2)'}
        height={`calc(var(--dynamic-height) - ${totalHeight}px)`}
        language={language}
        theme={'satoshi'}
        value={value}
        beforeMount={handleBeforeMount}
        onMount={handleMount}
        onChange={onChange}
        onValidate={onValidate}
        options={monacoOptions}
      />
    </div>
  )
}
