'use client';
import { use, useState } from 'react';

export default function Home() {
  const [range, setRange] = useState(0);
  const [uppercase, setUpperCase] = useState(false);
  const [lowercase, setLowerCase] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);
  const [password, setPassword] = useState('');
  const [strengthLevel, setStrengthLevel] = useState(null);

  function generatePassword() {
    if (range === 0) return;
    // Default options
    const config = {
      length: range,
      includeUppercase: uppercase,
      includeLowercase: lowercase,
      includeNumbers: numbers,
      includeSymbols: symbols
    };

    let strength = 0;
    // Define character sets
    const defineLowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const defineUpperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const defineNumberChars = '0123456789';
    const defineSymbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    // Always include lowercase letters in our available characters
    let availableChars = defineLowerChars;
    // Array to hold at least one character from each selected group
    const forcedChars = [];

    // If uppercase is enabled, include it and force one random uppercase character.
    if (config.includeUppercase) {
      strength += 1;
      availableChars += defineUpperChars;
      forcedChars.push(
        defineUpperChars[Math.floor(Math.random() * defineUpperChars.length)]
      );
    }

    if (config.includeLowercase) {
      strength += 1;
      availableChars += defineLowerChars;
      forcedChars.push(
        defineLowerChars[Math.floor(Math.random() * defineLowerChars.length)]
      );
    }
    // If numbers are enabled, include and force one random number.
    if (config.includeNumbers) {
      strength += 1;
      availableChars += defineNumberChars;
      forcedChars.push(
        defineNumberChars[Math.floor(Math.random() * defineNumberChars.length)]
      );
    }
    // If symbols are enabled, include and force one random symbol.
    if (config.includeSymbols) {
      strength += 1;
      availableChars += defineSymbolChars;
      forcedChars.push(
        defineSymbolChars[Math.floor(Math.random() * defineSymbolChars.length)]
      );
    }
    // // If no extra groups selected (only lowercases), the forcedChars array remains empty.
    // // Begin with any forced characters.
    const passwordChars = [...forcedChars];

    // Fill the remaining length with random characters from the entire available set.
    const remainingLength = config.length - passwordChars.length;
    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = Math.floor(Math.random() * availableChars.length);
      passwordChars.push(availableChars[randomIndex]);
    }

    // Shuffle the array to mix forced characters with the rest.
    for (let i = passwordChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordChars[i], passwordChars[j]] = [
        passwordChars[j],
        passwordChars[i]
      ];
    }

    passwordChars.join('');
    setStrengthLevel(strength);
    setPassword(passwordChars);
  }

  function copyToClipboard(text) {
    console.log(text);
    if (!text) return;
    if (navigator.clipboard && window.isSecureContext) {
      // Modern method with Clipboard API
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert('Password copied to clipboard!');
        })
        .catch((err) => {
          console.error('Clipboard error:', err);
        });
    } else {
      // Fallback for older browsers
      const tempInput = document.createElement('input');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      alert('Password copied to clipboard!');
    }
  }

  return (
    <div className='w-96 h-auto flex flex-col items-center gap-4'>
      <h1 className='text-lg tracking-widest text-slate-600'>
        Password Generator
      </h1>
      <div className='w-full flex items-center justify-between py-2 px-4 bg-slate-900'>
        <div className='text-2xl font-bold'>{password}</div>
        <div
          className='cursor-pointer'
          onClick={() =>
            copyToClipboard(password.reduce((acc, curr) => acc + curr, ''))
          }
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            color='lightGreen'
            className='lucide lucide-files-icon lucide-files'
          >
            <path d='M20 7h-3a2 2 0 0 1-2-2V2' />
            <path d='M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z' />
            <path d='M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8' />
          </svg>
        </div>
        {/* password options */}
      </div>
      <div className='w-full flex flex-col bg-slate-900 px-4'>
        <div className='w-full flex items-center justify-between  py-2'>
          <div>Character Length</div>
          <div className='text-2xl font-semibold text-green-300'>{range}</div>
        </div>
        <input
          type='range'
          value={range}
          max={20}
          min={0}
          step={1}
          onChange={(e) => setRange(e.target.value)}
        />
        <div className='my-5 text-lg text-slate-400'>
          <input
            type='checkbox'
            id='upperCase'
            className='w-4 h-4'
            onClick={() => setUpperCase(!uppercase)}
          />
          <label> Included Uppercase Letters</label>
          <br />
          <input
            type='checkbox'
            id='lowerCase'
            className='w-4 h-4'
            onClick={() => setLowerCase(!lowercase)}
          />
          <label> Included Lowercase Letters</label>
          <br />
          <input
            type='checkbox'
            id='numbers'
            className='w-4 h-4'
            onClick={() => setNumbers(!numbers)}
          />
          <label> Included Numbers</label>
          <br />
          <input
            type='checkbox'
            id='symbols'
            className='w-4 h-4'
            onClick={() => setSymbols(!symbols)}
          />
          <label> Included Symbols</label>
          <div className='w-full h-20 px-3 py-1 bg-slate-950 my-5 flex items-center justify-between font-monospace'>
            <div className='uppercase text-sm'>Strength</div>
            {strengthLevel === null && (
              <div className='h-16 flex items-center  gap-3'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-12 border' />
                  <div className='w-3 h-12 border' />
                  <div className='w-3 h-12 border' />
                  <div className='w-3 h-12 border' />
                </div>
              </div>
            )}
            {strengthLevel === 0 && (
              <div className='h-16 flex items-center gap-3'>
                WEEK
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-12 border' />
                  <div className='w-3 h-12 border' />
                  <div className='w-3 h-12 border' />
                  <div className='w-3 h-12 border' />
                </div>
              </div>
            )}
            {strengthLevel === 1 && (
              <div className='h-16 flex items-center gap-3'>
                WEEK
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-12 border border-red-500 bg-red-500' />
                  <div className='w-3 h-12 border' />
                  <div className='w-3 h-12 border' />
                  <div className='w-3 h-12 border' />
                </div>
              </div>
            )}
            {strengthLevel === 2 && (
              <div className='h-16 flex items-center gap-3'>
                MEDIUM
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-12 border border-red-500 bg-red-500' />
                  <div className='w-3 h-12 border border-yellow-400 bg-yellow-400' />
                  <div className='w-3 h-12 border' />
                  <div className='w-3 h-12 border' />
                </div>
              </div>
            )}
            {strengthLevel === 3 && (
              <div className='h-16 flex items-center gap-3'>
                STRONG
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-12 border border-red-500 bg-red-500' />
                  <div className='w-3 h-12 border border-yellow-400 bg-yellow-400' />
                  <div className='w-3 h-12 border border-green-600 bg-green-600' />
                  <div className='w-3 h-12 border' />
                </div>
              </div>
            )}
            {strengthLevel === 4 && (
              <div className='h-16 flex items-center  gap-3'>
                STRONG
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-12 border-red-500 bg-red-500' />
                  <div className='w-3 h-12 border border-yellow-400 bg-yellow-400' />
                  <div className='w-3 h-12 border border-green-600 bg-green-600' />
                  <div className='w-3 h-12 border border-green-400 bg-green-400' />
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => generatePassword()}
            className='w-full py-4 bg-green-300 hover:bg-green-600 cursor-pointer rounded-lg text-slate-800 uppercase font-normal tracking-wider'
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
