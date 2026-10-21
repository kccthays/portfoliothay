import { useEffect, useRef, useState } from 'react'
import LiquidCanvas from './LiquidCanvas'
import { TiltedGridHero } from './components/ui/tilted-grid-hero'

const NAV = [
  ['sobre', 'Sobre'],
  ['servicos', 'Serviços'],
  ['projetos', 'Projetos'],
  ['contato', 'Contato'],
] as const

const SERVICES = [
  {
    n: '01',
    title: 'Sites profissionais',
    short: 'Presença digital com personalidade',
    body: 'Crio sites profissionais para apresentar sua marca, seus serviços e as informações importantes do seu negócio.',
    tags: ['Estrutura', 'Visual', 'Responsivo'],
  },
  {
    n: '02',
    title: 'Catálogos digitais',
    short: 'Produtos organizados online',
    body: 'Organizo seus produtos ou serviços em um catálogo digital claro, bonito e fácil de consultar.',
    tags: ['Organização', 'Visual', 'Navegação'],
  },
  {
    n: '03',
    title: 'Landing pages',
    short: 'Uma página, um objetivo',
    body: 'Desenvolvo páginas focadas em apresentar uma oferta, um serviço ou uma campanha de forma direta.',
    tags: ['Foco', 'Conteúdo', 'Contato'],
  },
]

const PROJECTS = [
  { name: 'Ótica Lima', kind: 'Site profissional', year: 'Projeto entregue', desc: 'Site profissional desenvolvido para apresentar a Ótica Lima.', color: '#d4ff3f', mark: 'OL' },
]

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-bone-dim">{children}</p>
}

function Header() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid || open ? 'bg-ink/80 backdrop-blur-md' : ''}`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <a href="#topo" className="font-display text-2xl italic tracking-tight">
          Thay<span className="text-lime">.</span>
        </a>
        <nav className="hidden items-center gap-9 md:flex" aria-label="Principal">
          {NAV.map(([id, l]) => (
            <a key={id} href={`#${id}`} className="group relative text-sm text-bone/80 transition-colors hover:text-bone">
              {l}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-lime transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <button
          className="font-mono text-xs uppercase tracking-widest md:hidden"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? 'Fechar' : 'Menu'}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-6 pb-6 md:hidden" aria-label="Mobile">
          {NAV.map(([id, l]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="py-3 font-display text-4xl">
              {l}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

function Magnetic({ children, href, primary }: { children: React.ReactNode; href: string; primary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const move = (e: React.PointerEvent) => {
    const el = ref.current!
    const b = el.getBoundingClientRect()
    el.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * 0.18}px,${(e.clientY - b.top - b.height / 2) * 0.28}px)`
  }
  return (
    <a
      ref={ref}
      href={href}
      onPointerMove={move}
      onPointerLeave={() => (ref.current!.style.transform = '')}
      className={`inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-medium transition-[transform,background,color] duration-300 ease-out ${
        primary
          ? 'bg-lime text-ink hover:bg-bone'
          : 'border border-bone/30 text-bone hover:border-bone hover:bg-bone/10'
      }`}
    >
      {children}
    </a>
  )
}

function Hero() {
  return (
    <section id="topo" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink">
      <LiquidCanvas />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
      <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-16 pt-40 md:px-10 md:pb-24">
        <Label>Thay Torelli — sites profissionais · Portfólio</Label>
        <h1 className="reveal in mt-6 max-w-[14ch] font-display text-[clamp(3.4rem,10.5vw,10rem)] leading-[0.9] tracking-[-0.02em]">
          Sites que fazem sua marca <em className="text-lime">ser vista.</em>
        </h1>
        <div className="mt-12 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-md text-base leading-relaxed text-bone/85 md:text-lg">
            Sites profissionais para apresentar sua marca, seus serviços e as informações importantes do seu negócio.
          </p>
          <div className="flex flex-wrap gap-4">
            <Magnetic href="#contato" primary>
              Iniciar conversa <span aria-hidden>→</span>
            </Magnetic>
            <Magnetic href="#projetos">Explorar projetos</Magnetic>
          </div>
        </div>
      </div>
    </section>
  )
}

function About() {
  const stats = [
    ['3', 'formatos de site'],
    ['E.S.', 'Engenharia de Software'],
    ['OL', 'projeto entregue: Ótica Lima'],
  ]
  return (
    <section id="sobre" className="about-section bg-ink px-6 py-28 text-bone md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-12">
        <div className="reveal lg:col-span-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-bone-dim">01 / Sobre</p>
          <p className="about-section__aside mt-10 max-w-[12rem] font-display text-5xl leading-[0.9] italic md:text-6xl">
            Sites feitos para a sua marca aparecer.
          </p>
        </div>
        <div className="lg:col-span-8 lg:col-start-5">
          <p className="reveal font-display text-[clamp(2.2rem,4.8vw,5rem)] leading-[0.98]">
            Sou a Thay Torelli. Faço sites profissionais, catálogos digitais e landing pages para marcas que querem aparecer melhor na internet.
          </p>
          <div className="reveal mt-12 grid gap-8 border-t border-white/20 pt-8 text-bone/75 md:grid-cols-2">
            <p className="leading-relaxed">
              Faço Engenharia de Software e levo esse aprendizado para cada projeto, pensando em estrutura e clareza.
            </p>
            <p className="leading-relaxed">
              Meu objetivo é criar uma presença digital bonita, organizada e coerente com o que você oferece.
            </p>
          </div>
          <dl className="reveal about-stats mt-16 grid grid-cols-1 sm:grid-cols-3">
            {stats.map(([a, b]) => (
              <div key={b} className="border-t border-white/20 py-5 sm:pr-6">
                <dt className="font-display text-6xl leading-none">{a}</dt>
                <dd className="mt-3 max-w-[9rem] text-sm text-bone-dim">{b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

function Services() {
  const [open, setOpen] = useState(0)
  return (
    <section id="servicos" className="services-section bg-ink-2 px-6 py-28 text-bone md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <div className="reveal flex flex-wrap items-end justify-between gap-8">
          <div>
            <Label>02 / Serviços</Label>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(3rem,7vw,7rem)] leading-[0.88]">
              O que posso construir <em className="text-lime">com você.</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-bone-dim">Cada projeto começa com uma pergunta clara e termina em algo que dá vontade de usar.</p>
        </div>
        <ul className="services-list mt-20">
          {SERVICES.map((s, i) => {
            const active = open === i
            return (
              <li key={s.n} className="reveal services-list__item">
                <button
                  onClick={() => setOpen(active ? -1 : i)}
                  aria-expanded={active}
                  className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-7 text-left md:grid-cols-[5rem_1fr_1fr_auto]"
                >
                  <span className="font-mono text-xs text-bone-dim">{s.n}</span>
                  <span className={`font-display text-3xl transition-transform duration-500 md:text-5xl ${active ? 'translate-x-3 text-lime italic' : 'group-hover:translate-x-3'}`}>
                    {s.title}
                  </span>
                  <span className="hidden text-sm text-bone-dim md:block">{s.short}</span>
                  <span className={`grid size-10 place-items-center rounded-full border border-bone/30 text-xl transition-all duration-500 ${active ? 'rotate-45 bg-lime text-ink' : 'group-hover:border-lime group-hover:text-lime'}`} aria-hidden>
                    +
                  </span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="grid gap-6 pb-8 md:grid-cols-[5rem_1fr_1fr]">
                      <span />
                      <p className="max-w-lg leading-relaxed text-bone/75">{s.body}</p>
                      <ul className="flex flex-wrap content-start gap-2">
                        {s.tags.map((t) => <li key={t} className="rounded-full border border-bone/25 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-bone-dim">{t}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Projects() {
  const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700"%3E%3Crect width="1200" height="700" fill="%235a5a5a"/%3E%3C/svg%3E'
  const gallery = [
    { src: 'https://oticalima.vercel.app/assets/images/hero-principal.webp', alt: 'Hero do site da Ótica Lima' },
    ...Array.from({ length: 5 }, () => ({ src: placeholder, alt: 'Espaço reservado para um futuro projeto' })),
  ]
  return (
    <section id="projetos" className="projects-section bg-bone px-6 py-28 text-ink md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/60">03 / Projetos selecionados</p>
            <h2 className="mt-5 font-display text-[clamp(3rem,7vw,7rem)] leading-[0.88]">
              Um projeto <em className="text-[#5a1fd1]">real.</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ink/60">A Ótica Lima foi o primeiro projeto entregue. Os próximos espaços ficam abertos para novos trabalhos.</p>
        </div>

        <div className="reveal mt-20">
          <TiltedGridHero images={gallery} className="h-[360px] w-full md:h-[520px]">
            <a
              href="https://oticalima.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="absolute inset-0 z-10 flex items-end justify-between p-6 text-bone transition-colors hover:bg-ink/10 md:p-10"
              aria-label="Abrir o site da Ótica Lima"
            >
              <span className="font-display text-4xl italic md:text-6xl">Ótica Lima</span>
              <span className="rounded-full bg-lime px-4 py-2 text-sm font-medium text-ink">Visitar site ↗</span>
            </a>
          </TiltedGridHero>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [sent, setSent] = useState(false)
  const [type, setType] = useState('Site institucional')
  const types = ['Site profissional', 'Catálogo digital', 'Landing page']
  const field =
    'w-full border-b border-ink/30 bg-transparent py-3 text-lg text-ink placeholder:text-ink/45 transition-colors focus:border-[#5a1fd1] focus:outline-none'
  return (
    <section id="contato" className="contact-section relative isolate overflow-hidden bg-lime px-6 py-28 text-ink md:px-10 md:py-40">
      <div className="contact-section__orb pointer-events-none absolute -right-28 -top-28 -z-10 size-[480px] rounded-full bg-[#5a1fd1]" />
      <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-12">
        <div className="reveal lg:col-span-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/60">04 / Contato</p>
          <h2 className="mt-5 font-display text-[clamp(3rem,7.5vw,7.5rem)] leading-[0.92]">
            Vamos fazer sua marca <em className="text-[#5a1fd1]">ser vista?</em>
          </h2>
          <p className="mt-8 max-w-sm text-ink/70">
            Me chama no WhatsApp e conte um pouco sobre o que você precisa.
          </p>
          <p className="mt-8 font-mono text-sm">
            <a href="https://wa.me/5567993111181" className="underline decoration-[#5a1fd1] underline-offset-4 hover:text-[#5a1fd1]">
              WhatsApp: (67) 99311-1181
            </a>
          </p>
        </div>

        <form
          className="reveal contact-form space-y-9 lg:col-span-5 lg:col-start-8"
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
        >
          {sent ? (
            <div role="status" className="rounded-md border border-ink/30 p-8">
              <p className="font-display text-4xl italic text-[#5a1fd1]">Obrigada!</p>
              <p className="mt-3 text-ink/75">Recebi sua mensagem e logo entro em contato.</p>
              <button type="button" onClick={() => setSent(false)} className="mt-6 text-sm underline underline-offset-4">
                Enviar outra
              </button>
            </div>
          ) : (
            <>
              <fieldset>
                <legend className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/60">
                  Quero um(a)
                </legend>
                <div className="flex flex-wrap gap-2">
                  {types.map((t) => (
                    <button
                      type="button"
                      key={t}
                      aria-pressed={type === t}
                      onClick={() => setType(t)}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${type === t ? 'border-ink bg-ink text-bone' : 'border-ink/30 hover:border-ink'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="block">
                <span className="sr-only">Nome</span>
                <input required name="nome" placeholder="Seu nome" className={field} />
              </label>
              <label className="block">
                <span className="sr-only">E-mail</span>
                <input required type="email" name="email" placeholder="Seu e-mail" className={field} />
              </label>
              <label className="block">
                <span className="sr-only">Mensagem</span>
                <textarea required name="msg" rows={3} placeholder="Conte sobre o projeto" className={`${field} resize-none`} />
              </label>
              <button
                type="submit"
                className="rounded-full bg-ink px-8 py-4 text-sm font-medium text-bone transition-colors hover:bg-[#5a1fd1]"
              >
                Enviar mensagem →
              </button>
            </>
          )}
        </form>
      </div>
      <footer className="mx-auto mt-28 flex max-w-[1400px] flex-wrap justify-between gap-4 border-t border-ink/20 pt-6 font-mono text-[11px] uppercase tracking-widest text-ink/60">
        <span>© Thay Torelli</span>
        <span className="flex gap-6">
          <a href="https://wa.me/5567993111181" className="hover:text-[#5a1fd1]">WhatsApp</a>
        </span>
        <a href="#topo" className="hover:text-[#5a1fd1]">Voltar ao topo ↑</a>
      </footer>
    </section>
  )
}

export default function App() {
  useReveal()
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <Contact />
      </main>
    </>
  )
}
