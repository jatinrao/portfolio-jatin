interface HeroGreetingProps {
  text: string
}

export default function HeroGreeting({ text }: HeroGreetingProps) {
  return <p className="hero-greeting">{text}</p>
}
