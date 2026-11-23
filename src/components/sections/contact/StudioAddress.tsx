export function StudioAddress({ city, address, phone }: { city: string; address: string; phone: string }) {
  return (
    <div data-contact-fade="">
      <h3 className="t-label text-bone">{city}</h3>
      <address className="mt-4 text-small not-italic text-stone">
        <span className="block max-w-[26ch]">{address}</span>
        <a href={`tel:${phone.replace(/\s/g, "")}`} className="u-link mt-2 inline-block text-bone" data-cursor="link">
          {phone}
        </a>
      </address>
    </div>
  );
}
