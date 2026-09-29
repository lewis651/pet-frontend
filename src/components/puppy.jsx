import React from 'react';

export function PuppyCard({ puppy, onOpen }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-[#EADFF0] bg-white shadow-md shadow-[#3B2350]/5 transition duration-300 hover:-translate-y-1.5 hover:border-[#D8C4E6] hover:shadow-2xl">
      <button
        type="button"
        onClick={() => onOpen(puppy)}
        className="relative aspect-[4/5] w-full overflow-hidden text-left"
      >
        <img
          src={puppy.images[0]}
          alt={`${puppy.name} available for adoption`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-xs font-extrabold text-[#4B2C63] shadow-sm">
          {puppy.breedType}
        </span>
        <span className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-white">
          {puppy.images.length} photos
        </span>
        <span className="absolute bottom-4 right-4 rounded-full bg-[#EBCB8B] px-3.5 py-1.5 text-base font-black text-[#3B2350] shadow-md">
          {puppy.adoptionFee}
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-[#3B2350]">{puppy.name}</h3>
            <span className="text-xs font-bold text-[#8A75A0]">{puppy.gender}</span>
          </div>
          <p className="mt-1 text-sm font-bold text-[#6B4A86]">{puppy.breed}</p>
          <p className="mt-1 text-xs text-[#6A5A70]">Age: {puppy.age} · Weight: {puppy.weight}</p>
        </div>

        {/* Vaccination & Health Badges */}
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-extrabold text-emerald-800">
            ✓ 5-in-1 DHPP
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 text-[11px] font-extrabold text-[#6C428E]">
            ✓ Dewormed x4
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-extrabold text-amber-900">
            ✓ Microchipped
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpen(puppy)}
          className="mt-auto rounded-2xl bg-[#3B2350] px-5 py-3.5 text-sm font-extrabold text-white shadow-md shadow-[#3B2350]/10 transition hover:-translate-y-0.5 hover:bg-[#54356E]"
        >
          View puppy details
        </button>
      </div>
    </article>
  );
}