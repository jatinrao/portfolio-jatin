import { LangId, localize } from "@/lib/locale";


export default function ConnectChannelsVariant({ channels, locale }: { channels: any; locale: LangId }) {

  return (
    <section style={{ marginLeft: '0', position: 'relative', marginTop: '-4.23mm' /* was -16px */ }}>
  <div
    style={{
    //   borderBottom: '0.26mm solid var(--color-outline, #d1d5db)', // was 1px
    //   paddingBottom: '2.12mm', // was 8px
      marginBottom: '2.12mm', // was 8px
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <p
      style={{
        fontFamily: 'var(--font-label-caps)',
        fontSize: '1rem', // text-md — left as-is, see note below
        color: 'var(--color-on-surface)',
        textTransform: 'uppercase',
        letterSpacing: '-0.05em', // tracking-tighter — relative unit, see note below
        display: 'flex',
        alignItems: 'center',
      }}
    >
      CONNECT
    </p>

    {/* Fixed-position label, always in the same spot */}
  </div>

  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4.23mm' ,marginTop:"-4.23mm" /* was 16px */ }}>
    {channels.map((channel: any) => (
      <a
        key={localize(channel.label, locale)}
        href={channel.url}
        // onMouseEnter={() => setHovered(channel)}
        // onMouseLeave={() => setHovered(null)}
        // onFocus={() => setHovered(channel)}
        // onBlur={() => setHovered(null)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '12.7mm', // was 48px
          height: '12.7mm', // was 48px
          border: '0.26mm solid var(--color-primary)', // was 1px
          backgroundColor: 'transparent',
          transitionProperty: 'background-color',
          transitionDuration: '150ms',
        }}
      >
        <div
          style={{
            display: 'none', // was `hidden group-hover:block`
            position: 'absolute',
            top: '1.06mm', // was 4px
            left: '1.06mm', // was 4px
            opacity: 0.5,
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            zIndex: 10,
          }}
        >
          <span
            dangerouslySetInnerHTML={{ __html: channel.icon.svg }}
            style={{ color: 'var(--color-primary)' }}
          />
        </div>
      </a>
    ))}
  </div>
</section>
  );
}