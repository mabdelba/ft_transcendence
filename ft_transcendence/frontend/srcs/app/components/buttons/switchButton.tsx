'use client'

import { useState } from 'react'
import { Switch } from '@headlessui/react'

export default function SwitchButton( {enabled, setEnabled} : {enabled: boolean, setEnabled: any}) {
//   const [enabled, setEnabled] = useState(false)

  return (
    <div className="py-16">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${!enabled ? 'bg-[#484848]' : 'bg-blue-950'}
          relative inline-flex h-[34px] w-[70px] shrink-0 cursor-pointer rounded-2xl border-2  transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[30px] w-[30px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  )
}
