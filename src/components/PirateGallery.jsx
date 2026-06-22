import React, { useState } from 'react';
import TiltCard from './TiltCard';
import { audioSynth } from '../utils/audioSynth';

export default function PirateGallery({ isAudioPlaying }) {
  const [activeShipIdx, setActiveShipIdx] = useState(0);

  // Play rustle sound whenever user switches tabs or flips cards
  const playInteractionSound = () => {
    if (isAudioPlaying) {
      audioSynth.playPaperRustle();
    }
  };

  // 15 Cards Data with custom stats and back content
  const crewCards = [
    {
      id: 'vance',
      title: 'Captain Vance',
      subtitle: 'The Solar Captain',
      description: 'A charismatic captain with silver hair and a glowing arm of pure solar energy.',
      artwork: '/assets/pirates/captain_vance.png',
      stats: [
        { label: 'Attendance Ldr', value: 'S-Rank' },
        { label: 'Solar Power', value: '9800 XP' }
      ],
      backContent: (
        <div className="rpg-card-back">
          <div className="bounty-scroll">
            <h4 style={{ color: '#ffd700' }}>🏆 BOUNTY: 50,000,000 BERI</h4>
            <p><strong>Special Ability:</strong> <em>Attendance Multiplier.</em> Leads study voyages with +20% bonus XP for attending early-morning lectures.</p>
            <div className="detail-stat">
              <span>Signature Move:</span>
              <span className="accent-text">Solar Flare Strike</span>
            </div>
            <div className="detail-stat">
              <span>Academic Motto:</span>
              <span>"No Navigator left behind!"</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'lyra',
      title: 'Navigator Lyra',
      subtitle: 'The Star Charter',
      description: 'An energetic navigator plotting routes with a glowing, holographic star globe.',
      artwork: '/assets/pirates/navigator_lyra.png',
      stats: [
        { label: 'Routing Sync', value: 'A-Rank' },
        { label: 'Aether Map', value: '8900 XP' }
      ],
      backContent: (
        <div className="rpg-card-back">
          <div className="bounty-scroll">
            <h4 style={{ color: '#00f2fe' }}>🧭 MAPMAKER LOG</h4>
            <p><strong>Special Ability:</strong> <em>Pathfinder.</em> Dynamically highlights the shortest pathways between lecture classrooms.</p>
            <div className="detail-stat">
              <span>Tool:</span>
              <span className="accent-text">Astromancy Astrolabe</span>
            </div>
            <div className="detail-stat">
              <span>Favorite Subject:</span>
              <span>Celestial Geometry</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'jin',
      title: 'First Mate Jin',
      subtitle: 'The Crystal Sword',
      description: 'A stoic swordsman wielding a giant, glowing blade of pink rose quartz.',
      artwork: '/assets/pirates/first_mate_jin.png',
      stats: [
        { label: 'Focus Parry', value: 'S-Rank' },
        { label: 'Crystal Slice', value: '9500 XP' }
      ],
      backContent: (
        <div className="rpg-card-back">
          <div className="bounty-scroll">
            <h4 style={{ color: '#ff007f' }}>⚔️ SWORDSMAN DIARY</h4>
            <p><strong>Special Ability:</strong> <em>Deadline Slash.</em> His crystal strikes reduce quiz stress and delay assignments by 1 day.</p>
            <div className="detail-stat">
              <span>Blade:</span>
              <span className="accent-text">Rose Quartz Greatsword</span>
            </div>
            <div className="detail-stat">
              <span>Discipline:</span>
              <span>Infinite Focus Swordsmanship</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'barnaby',
      title: 'Barnaby "The Boiler"',
      subtitle: 'Cyborg Shipwright',
      description: 'A dwarven cyborg with a beard of glowing blue steam and tool arm.',
      artwork: '/assets/pirates/shipwright_barnaby.png',
      stats: [
        { label: 'GPA Repairs', value: 'B-Rank' },
        { label: 'Steam Engine', value: '7800 XP' }
      ],
      backContent: (
        <div className="rpg-card-back">
          <div className="bounty-scroll">
            <h4 style={{ color: '#00f2fe' }}>🔧 WORKSHOP MANUAL</h4>
            <p><strong>Special Ability:</strong> <em>GPA Repair.</em> Employs steam-powered mechanical logic to patch ship damage caused by low attendance.</p>
            <div className="detail-stat">
              <span>Tool:</span>
              <span className="accent-text">Pneumatic Riveter Hand</span>
            </div>
            <div className="detail-stat">
              <span>Favorite Fuel:</span>
              <span>Espresso Steam-Condensate</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'pippin',
      title: 'Pippin the Chef',
      subtitle: 'The Spice Weaver',
      description: 'A cat-like chef juggling glowing culinary spices over a magical cooking pot.',
      artwork: '/assets/pirates/chef_pippin.png',
      stats: [
        { label: 'Focus Brew', value: 'A-Rank' },
        { label: 'Magic Stew', value: '8200 XP' }
      ],
      backContent: (
        <div className="rpg-card-back">
          <div className="bounty-scroll">
            <h4 style={{ color: '#ffd700' }}>🍲 GALLEY LOGBOOK</h4>
            <p><strong>Special Ability:</strong> <em>Study Stew.</em> Feeds the crew magical spices, boosting Pomodoro Focus effectiveness by +20%.</p>
            <div className="detail-stat">
              <span>Key Spice:</span>
              <span className="accent-text">Starlight Sage</span>
            </div>
            <div className="detail-stat">
              <span>Secret Recipe:</span>
              <span>Midterm Survival Brew</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const shipCards = [
    {
      id: 'solar_flare',
      title: 'The Solar Flare',
      subtitle: 'Aether Flagship',
      description: 'A majestic white wooden galleon fueled by giant solar sails of pure light.',
      artwork: '/assets/pirates/ship_solar_flare.png',
      stats: [
        { label: 'Cruise Spd', value: 'Mach 3' },
        { label: 'Solar Rig', value: 'Lvl 5' }
      ],
      backContent: (
        <div className="rpg-card-back">
          <div className="bounty-scroll">
            <h4 style={{ color: '#ffd700' }}>⛵ VESSEL REGISTER</h4>
            <p>The primary flag vessel of the Grand Academic Voyage. Propelled across clouds by harvesting Solar currents.</p>
            <div className="detail-stat">
              <span>Figurehead:</span>
              <span className="accent-text">Roaring Solar Lion</span>
            </div>
            <div className="detail-stat">
              <span>Hull Type:</span>
              <span>Ironwood Cloud-Glider</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'rusty_barnacle',
      title: 'The Rusty Barnacle',
      subtitle: 'Submersible Explorer',
      description: 'A copper-plated steampunk submarine glowing with green bioluminescence.',
      artwork: '/assets/pirates/sub_rusty_barnacle.png',
      stats: [
        { label: 'Max Depth', value: '9000m' },
        { label: 'Steampunk', value: 'Lvl 4' }
      ],
      backContent: (
        <div className="rpg-card-back">
          <div className="bounty-scroll">
            <h4 style={{ color: '#00f2fe' }}>⚓ SUB LOG</h4>
            <p>Used to dive into deep ocean trenches to recover forgotten blueprints, libraries, and academic databases.</p>
            <div className="detail-stat">
              <span>Propulsion:</span>
              <span className="accent-text">Twin Steam Screws</span>
            </div>
            <div className="detail-stat">
              <span>Diving Cage:</span>
              <span>Reinforced Brass dome</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'goliath_shell',
      title: 'The Goliath-Shell',
      subtitle: 'Living Island Ship',
      description: 'An ancient colossal sea turtle carrying a pirate village and watchtowers.',
      artwork: '/assets/pirates/turtle_goliath.png',
      stats: [
        { label: 'Max Load', value: '500 Tons' },
        { label: 'Behemoth', value: 'Ancient' }
      ],
      backContent: (
        <div className="rpg-card-back">
          <div className="bounty-scroll">
            <h4 style={{ color: '#ffd700' }}>🐢 BEHEMOTH LOG</h4>
            <p>An ancient beast that acts as a mobile floating campus turtle, hosting giant lecture halls on its back.</p>
            <div className="detail-stat">
              <span>Turtle Name:</span>
              <span className="accent-text">Old Mossyback</span>
            </div>
            <div className="detail-stat">
              <span>Shell Diameter:</span>
              <span>120 meters</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const locationCards = [
    {
      id: 'floating_reef',
      title: 'Sky Reef of Zephyr',
      subtitle: 'Sky Archipelago',
      description: 'Floating coral reefs high in the sky with waterfalls plunging into clouds.',
      artwork: '/assets/pirates/floating_reef.png',
      stats: [
        { label: 'Altitude', value: '4500m' },
        { label: 'Wind Current', value: 'Gale' }
      ]
    },
    {
      id: 'chrono_whirlpool',
      title: 'The Chrono-Whirlpool',
      subtitle: 'Vortex of Time',
      description: 'A massive glowing purple whirlpool trapping ancient shipwrecks in time.',
      artwork: '/assets/pirates/chrono_whirlpool.png',
      stats: [
        { label: 'Time Dilation', value: '1.25x' },
        { label: 'Anomalies', value: 'Extreme' }
      ]
    },
    {
      id: 'bio_lagoon',
      title: 'Bioluminescent Lagoon',
      subtitle: 'Moonlit Sanctuary',
      description: 'Glowing turquoise water under two moons, anchored with the Solar Flare.',
      artwork: '/assets/pirates/bio_lagoon.png',
      stats: [
        { label: 'Luminescence', value: '100%' },
        { label: 'Safety Index', value: 'High' }
      ]
    },
    {
      id: 'mangrove_maze',
      title: 'Mangrove Maze',
      subtitle: 'The Whispering Swamp',
      description: 'Giant trees with glowing red roots twisting through dense, colorful fog.',
      artwork: '/assets/pirates/mangrove_maze.png',
      stats: [
        { label: 'Complexity', value: '99%' },
        { label: 'Fog Level', value: 'Thick' }
      ]
    }
  ];

  const eventCards = [
    {
      id: 'clash',
      title: 'Vance vs The Sea-Admiral',
      subtitle: 'Epic Clash',
      description: 'Captain Vance clashing his solar fist against the Admiral\'s ice blade.',
      artwork: '/assets/pirates/clash_vance_admiral.png',
      stats: [
        { label: 'Clash Force', value: '9.8M' },
        { label: 'Bounty Clash', value: 'Critical' }
      ]
    },
    {
      id: 'unearth',
      title: 'Finding the Star-Shard',
      subtitle: 'Ancient Chamber',
      description: 'The crew unearthing a glowing celestial crystal inside a hidden cavern.',
      artwork: '/assets/pirates/unearthing_shard.png',
      stats: [
        { label: 'Shard Power', value: 'Infinite' },
        { label: 'Ruins Lvl', value: 'Mythic' }
      ]
    },
    {
      id: 'escape',
      title: 'The Great Escape',
      subtitle: 'Waterspout Launch',
      description: 'The Solar Flare launching up a waterspout to escape a pursuing fleet.',
      artwork: '/assets/pirates/great_escape.png',
      stats: [
        { label: 'Ascent Speed', value: '90 kts' },
        { label: 'Escape Odds', value: '1%' }
      ]
    }
  ];

  const handleShipClick = () => {
    playInteractionSound();
    setActiveShipIdx((prev) => (prev + 1) % shipCards.length);
  };

  const getShipSlideClass = (idx) => {
    const total = shipCards.length;
    if (idx === activeShipIdx) return 'carousel-slide active';
    if (idx === (activeShipIdx + 1) % total) return 'carousel-slide next';
    if (idx === (activeShipIdx - 1 + total) % total) return 'carousel-slide prev';
    return 'carousel-slide hidden';
  };

  return (
    <div className="gallery-section scrollable-container">
      <div className="hub-header">
        <h2 className="hub-title">📖 Captain's Logbook & Gallery</h2>
        <p className="hub-desc">
          Browse the milestones, crew members, and vessels of the <strong>Grand Voyage</strong>. Hover cards to activate their 3D parallax field, and click to flip them open.
        </p>
      </div>

      {/* CATEGORY 1: THE CREW (3D FAN-OF-CARDS LAYOUT) */}
      <div className="gallery-row-section">
        <h3 className="category-title">👥 The Grand Voyage Crew</h3>
        <p className="category-desc">Our elite crew mapping the timetables of the cosmos. Hover to fan out, click to read abilities.</p>
        <div className="card-hand" onClick={playInteractionSound}>
          {crewCards.map((card) => (
            <div key={card.id} className="hand-item">
              <TiltCard {...card} />
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY 2: THE FLEET (3D STACK CAROUSEL LAYOUT) */}
      <div className="gallery-row-section flex-row-layout">
        <div className="text-col">
          <h3 className="category-title">⚓ Legendary Fleet Vessels</h3>
          <p className="category-desc">
            The ships that transport us across classes and exams. 
            <br /><strong>Click the deck</strong> to cycle vessels!
          </p>
          <div className="ship-indicators">
            {shipCards.map((ship, idx) => (
              <span 
                key={ship.id} 
                className={`ship-dot ${idx === activeShipIdx ? 'active' : ''}`}
                onClick={() => { playInteractionSound(); setActiveShipIdx(idx); }}
              />
            ))}
          </div>
        </div>
        <div className="carousel-col">
          <div className="card-stack-carousel" onClick={handleShipClick}>
            {shipCards.map((card, idx) => (
              <div key={card.id} className={getShipSlideClass(idx)}>
                <TiltCard {...card} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORY 3: UNCHARTED REEFS (TILT GRID) */}
      <div className="gallery-row-section">
        <h3 className="category-title">🗺️ Uncharted Reefs & Islands</h3>
        <p className="category-desc">Bizarre coordinates of the sea. Hover to reveal the 3D depth layers.</p>
        <div className="cards-grid-container" onClick={playInteractionSound}>
          {locationCards.map((card) => (
            <TiltCard key={card.id} {...card} />
          ))}
        </div>
      </div>

      {/* CATEGORY 4: EVENTS & CLASHES */}
      <div className="gallery-row-section" style={{ marginBottom: '40px' }}>
        <h3 className="category-title">📜 Voyage Chronology</h3>
        <p className="category-desc">Key historical moments logged during semesters.</p>
        <div className="cards-grid-container" onClick={playInteractionSound}>
          {eventCards.map((card) => (
            <TiltCard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
