'use client'
import Script from "next/script";
import Image from "next/image";
import {useEffect, useRef, useState} from "react";

export default function Home() {

    const circle = useRef<HTMLButtonElement>(null);
    const score = useRef<HTMLHeadingElement>(null)
    const [image, setImage] = useState<string>('')

    const handleImage = () => {
        setImage(getScore() < 50 ? '/assets/frog.png' : '/assets/lizard.png')
    }

    useEffect(() => {
        setScore(getScore())
        handleImage()
    }, []);


    function setScore(value: number) {
        if (score.current) {
            localStorage.setItem('score', value.toString())
            score.current.textContent = value.toString()
        }
    }


    function getScore() {
        return Number(localStorage.getItem('score')) ?? 0
    }

    function addOne() {
        setScore(getScore() + 1)
        handleImage()
    }

    const onClick = (event: any) => {
        const rect = circle.current?.getBoundingClientRect() as DOMRect
        const offfsetX = event.clientX - rect.left - rect.width / 2
        const offfsetY = event.clientY - rect.top - rect.height / 2
        const DEG = 40

        const tiltX = (offfsetY / rect.height) * DEG
        const tiltY = (offfsetX / rect.width) * -DEG

        circle.current?.style.setProperty('--tiltX', `${tiltX}deg`)
        circle.current?.style.setProperty('--tiltY', `${tiltY}deg`)

        setTimeout(() => {
            circle.current?.style.setProperty('--tiltX', `0deg`)
            circle.current?.style.setProperty('--tiltY', `0deg`)
        }, 300)

        const plusOne = document.createElement('div')
        plusOne.classList.add('plus-one')
        plusOne.textContent = '+1'
        plusOne.style.left = `${event.clientX - rect.left}px`
        plusOne.style.top = `${event.clientY - rect.top}px`

        // @ts-ignore
        circle.current.parentElement.appendChild(plusOne)

        addOne()

        setTimeout(() => {
            plusOne.remove()
        }, 2000)
    }


    return (
        <>
            <main className="p-4">
                <div className="game relative">
                    <div className="header">
                        <Image src="/assets/coin.png" alt="coin" width={50} height={50}/>
                        <h2 className="score" id="score" ref={score}>0</h2>
                    </div>

                    <button className="circle" onClick={onClick} ref={circle}>
                        <Image id="circle" src={image} alt="frog" width={200} height={200}
                               draggable={false}/>
                    </button>

                </div>
            </main>
            <Script src='/scripts/app.js' strategy='afterInteractive'/>
        </>

    );
}
