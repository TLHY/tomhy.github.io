# Sensory Spire: paper-inspired cards

Four fields each have ten distinct basic cards and ten special cards. A new run starts with its ten basics; rewards offer field specials, with at least one card matching the starting field. Existing saved cards remain playable. There are 80 active designs: 40 basics and 40 field specials.

## Evidence and scope

The user supplied the paper titles, venues, links, and summaries used for field specials. The catalog uses 35 distinct supplied paper records across 40 field specials; cross-disciplinary papers can inspire different mechanics in different fields, but each field has ten distinct paper references. The latest supplied list explicitly includes journals, WHC, and arXiv alongside CHI/UIST/IEEE VR; these entries retain their supplied venue rather than being relabeled as conference papers.

Linked abstracts and bibliographic metadata have **not been independently verified**. Direct requests to DOI, Google Scholar, and HCI Tech Lab returned proxy 403 errors. Card concepts are paraphrases of the supplied summaries, not quotations from abstracts. Game effects and all numbers are fictional adaptations. The descriptor-conditioned diffusion paper's exact CHI track is unverified.

Neutral cards have been removed from the active catalog and rewards. Old saved Neutral cards are replaced with matching starter basics in the deck and combat piles, keeping upgrades and pile sizes; retired reward choices become unique field specials. Historical source metadata is retained only for compatibility.

## Deck identities and shared mechanics

- **Vibration — shield, tank, retaliation.** Temporary Retaliation expires after the enemy finishes acting; permanent Retaliation lasts the battle. Both respond to every non-evaded incoming hit, including fully blocked hits. A fatal hit prevents counters and counter healing. Shield strikes scale from pre-card Block without spending it. Retain carries a percentage of remaining Block into the next turn, capped at 75%, before adding armor.
- **Thermal — damage over time.** Heat bypasses Block and ticks before the enemy. Heat potency adds to each application, thermal memory prevents the normal one-stack decay, and extra ticks deal damage without spending Heat. Thermal Masking temporarily hides existing Heat, evades one hit, and relocates the hidden warmth with a bonus; legacy physical counters remain loadable but are not its current effect.
- **Multimodal — explicit two-card fusion.** Select two hand cards, preview their combined attack/Block and bonuses, then confirm for 1 Energy. Materials are discarded or exhausted; their normal play effects do not also execute. Draw resolves before materials enter discard. Multimodal starters can fuse any pair; other starters must include a selected Multimodal material. Fusion power improves both attack and defense. Cancel/reload of selection spends nothing.
- **HapticGeneration — installed turrets.** Up to three turrets persist for the encounter and activate at turn end before Heat and the enemy. Roles include Pulse, Shield, Rail, Scatter, Suppressor, Repair, Bastion, Supply, and Recon. Supply/Recon queue resources for the next turn; manual activation can trigger another cycle. Dismantling frees a slot with no card/Energy refund. Firmware caps are 20 for damage/shields, 4 for repair, and 3 for suppression/resources. Installations reset between encounters.

Paper concepts, author-supplied summaries, and source links are preserved separately from the fictional rules. The themed effects live in `assets/js/haptic-deck-themes.js`; original paper metadata lives in `haptic-paper-cards.js`. Individual card IDs, upgrades, archetypes, and relic IDs remain save-compatible; new battle fields receive safe defaults on older saves. Rebalanced card effects apply to existing card IDs as well.

## Distinctive paper protocols

Every field special has a unique protocol ID, conditional trigger, staged behavior, or material/installation rule. `assets/js/haptic-paper-protocols.js` owns these rules; `haptic-deck-themes.js` stores base/upgrade values and the explicit paper-to-game mapping. Selection-dependent cards open a choice window before committing resources; closing it costs nothing. The last selected recipe is not silently substituted.

The persistent protocol state covers recorded/replayed waveforms, hidden/referred Heat, six-site wrist circuits, thermal paths and insulation, module/avatar/cabin context, and staged turret programs. New saves keep this state; old saves receive an empty protocol state. Unknown keys and malformed phase/progress data are rejected. Fusion previews are read-only and expose conditional piercing, split hits, delayed shields and returned materials.

## Device relics

| Device | New effect |
| --- | --- |
| Geomagic Touch | Start each battle with 5 Block and retain 25% of remaining Block between turns. |
| Novint Falcon | The first turret installed each battle activates immediately once, then keeps its normal turn-end activation. |
| Haptuator | Start each battle with 2 permanent Retaliation: counter each incoming hit that is not evaded. |
| Peltier Thermode | Start each battle with 3 enemy Heat. Every Heat application gains +1 Heat. |
| Electrotactile Array | Every fusion gains +2 damage and +2 Block. Draw one extra card on the first turn. |
| SenseGlove | The first counterattack each turn heals 1 HP. Heal 4 HP after winning a battle. |

Starting devices: Vibration → Geomagic Touch; Thermal → Peltier Thermode; Multimodal → Electrotactile Array; HapticGeneration → Novint Falcon. Device bonuses are fictional game associations, not performance claims.

## Vibration

| Special card | Cost | Distinctive rule (base version) | Source |
| --- | --- | --- | --- |
| Referred Contact | 1 | Gain 5 Block. The next hit that meets your shield returns 1 × blocked damage as a referred counter (cap 18). | [Event-Based Referred Vibrotactile Feedback for Bare-Hand XR Interaction](https://ieeevr.org/2026/program/papers/) · IEEE VR 2026 |
| Stretching Sequence | 2 | Gain 8 Block. The next three non-evaded hits trace a moving contact: counter 2, twice that, then three times that. | ["Feeling" the Stretch: Enhancing Embodiment in Virtual Arm Elongation through Spatiotemporal Modulation of Visio-Haptic Feedback](https://ieeevr.org/2026/program/papers/) · IEEE VR 2026 |
| Masking Pulse | 1 | Gain 3 Block. Your next hit while shielded is fully masked even if Block is too small; return a 6-damage counter. | [Thermal Masking: When the Illusion Takes Over the Real](https://doi.org/10.1145/3613904.3641941) · CHI 2024 |
| Perceptual Boundaries | 2 | Gain 8 Block. Every fully blocked hit banks 3 Block for next turn (boundary bank cap 12). Exhaust. | [Thermal Masking Across the Human Body: Patterns, Pathways, and Perceptual Boundaries](https://doi.org/10.1145/3772318.3791601) · CHI 2026 |
| Stimulation Crossover | 2 | If current Block meets the enemy single-hit intent, gain 3 permanent Retaliation; otherwise gain 3 × 3 Block and 3 temporary Retaliation. | [Comparing Electrical and Vibrotactile Stimulation for Thermal Referral on the Forearm](https://scholar.gist.ac.kr/handle/local/34466) · CHI 2026 |
| Fiery Pulse | 2 | Install contact coupling: fully blocked hits apply 2 Heat; hits that lose HP rebuild 2 × 2 Block for the following hit. Exhaust. | [Fiery Hands: Designing Thermal Glove through Thermal and Tactile Integration for Virtual Object Manipulation](https://doi.org/10.1145/3654777.3676457) · UIST 2024 |
| Prompted Resonance | 2 | Record the next incoming non-evaded waveform (+2 amplitude, cap 18). Replay it as a counter at each of the following two turn ends. Exhaust. | [HapticGen: Generative Text-to-Vibration Model for Streamlining Haptic Design](https://doi.org/10.1145/3706598.3713609) · CHI 2025 |
| Conversational Tuning | 1 | Retrieve 2 defensive cards from draw/discard instead of drawing randomly. Gain 4 Block. | [ChatHAP: A Chat-Based Haptic System for Designing Vibrations through Conversation](https://doi.org/10.1145/3706598.3713441) · CHI 2025 |
| Texture Adversary | 2 | Learn from the enemy: losing HP adds 1 permanent Retaliation; a fully blocked hit adds 5% Block retention (cap 75%). Exhaust. | [TexSenseGAN: A User-Guided System for Optimizing Texture-Related Vibrotactile Feedback Using Generative Adversarial Network](https://doi.org/10.1109/TOH.2025.3542424) · IEEE Transactions on Haptics 2025 |
| Adaptive Rendering | 2 | Each previously unseen enemy intent pattern builds 6 Block before it attacks. Exhaust. | [Development and Evaluation of a Learning-Based Model for Real-Time Haptic Texture Rendering](https://doi.org/10.1109/TOH.2024.3382258) · IEEE Transactions on Haptics 2024 |

## Thermal

| Special card | Cost | Distinctive rule (base version) | Source |
| --- | --- | --- | --- |
| Thermal Referral | 2 | Deal 3 thermal damage twice and apply 4 Heat. A referred echo applies 3 more Heat at your next turn start. | [ThermoCaress: A Wearable Haptic Device with Illusory Moving Thermal Stimulation](https://doi.org/10.1145/3411764.3445777) · CHI 2021 |
| Thermal Masking | 2 | Hide all current enemy Heat and evade one hit. On evasion, relocate the hidden Heat back onto the enemy with +7 Heat. Exhaust. | [Thermal Masking: When the Illusion Takes Over the Real](https://doi.org/10.1145/3613904.3641941) · CHI 2024 |
| Six-Point Barrier | 2 | Close a six-site wrist circuit: every Heat application grants 2 Block. Every sixth application triggers a bonus Heat tick. Exhaust. | [ThermalBracelet: Exploring Thermal Haptic Feedback Around the Wrist](https://doi.org/10.1145/3290605.3300400) · CHI 2019 |
| Immersive Warmth | 2 | Thermal presence: from the third Heat application each turn onward, add 50% extra Heat per application. Exhaust. | [ThermoVR: Exploring Integrated Thermal Haptic Feedback with Head Mounted Displays](https://doi.org/10.1145/3025453.3025824) · CHI 2017 |
| HeatFlow Sweep | 2 | Choose a 2D route: Straight front-loads 2 × 3 Heat then visits two more nodes; Loop adds 3 at three turn ends and triggers three bonus Heat passes when closed. | [HeatFlow: A Thermal-Tactile Display for Dynamic 2D Thermal Movements](https://doi.org/10.1145/3746059.3747619) · UIST 2025 |
| Thermal In Motion | 2 | The next three Heat ticks accelerate: +25%, twice that, then three times that. Does not consume Heat. Exhaust. | [Thermal In Motion: Designing Thermal Flow Illusions with Tactile and Thermal Interaction](https://doi.org/10.1145/3654777.3676460) · UIST 2024 |
| Flip-Pelt Switch | 1 | Alternate Peltier faces: Hot applies 6 Heat. Cold grants Block equal to Heat + 6 (cap 28) and prevents the next natural decay. | [Flip-Pelt: Motor-Driven Peltier Elements for Rapid Thermal Stimulation and Congruent Pressure Feedback in Virtual Reality](https://doi.org/10.1145/3654777.3676363) · UIST 2024 |
| Unbroken Grasp | 1 | Keep grasping: the first fresh Block gain each turn applies 3 Heat without requiring another thermal card. Exhaust. | [ThermalGrasp: Enabling Thermal Feedback even while Grasping and Walking](https://ieeevr.org/2024/program/papers/) · IEEE VR 2024 |
| ChillFactor | 1 | Evaporate up to 4 Heat. Before the next incoming hit, release 6 + 2 per evaporated Heat as Block. Apply 2 Weak. | [ChillFactor: A Highly-Responsive Non-Contact Cooling Feedback Interface for VR Headsets Based on Alcohol Mist Evaporation](https://ieeevr.org/2026/program/papers/) · IEEE VR 2026 |
| Conductive Release | 2 | Choose material: Conductor doubles the next Heat tick then halves Heat; Insulator prevents the next 2 natural Heat decays. Exhaust. | [Which is Warmer, the Cake or the Oven? Unlocking Thermal Conductivity for Virtual Reality Interaction](https://doi.org/10.1145/3772318.3790864) · CHI 2026 |

## Multimodal

| Special card | Cost | Distinctive rule (base version) | Source |
| --- | --- | --- | --- |
| SensoryBlox | 2 | Choose one persistent module: Heat adds 3 Heat to fusions, airflow adds 1 Weak, or scent adds 1 draw. As material, add 3 Heat with a Thermal partner, otherwise 1 Weak. Material: 8 attack / 10 defense. | [SensoryBlox: Plug-and-Feel Modular Multi-Sensory User Interface for Immersive Cardboard VR](https://doi.org/10.1145/3772318.3791596) · CHI 2026 |
| Moisture Transfer | 1 | Gain 6 Block. When fused with a thermal cue, transfer up to 6 fused attack into extra defense; otherwise the transfer does not occur. Material: 5 attack / 10 defense. | [Moisture Transfer: A Perceptual Wetness Illusion Through Thermal and Wet Integration](https://doi.org/10.1145/3772318.3791603) · CHI 2026 |
| Avatar Confidence | 1 | Activate avatar context: every fusion boosts its dominant attack/defense value by 4. As material, bias that fusion once. Exhaust. Material: 8 attack / 8 defense. | [The Effects of Avatar and Environment on Thermal Perception and Skin Temperature in Virtual Reality](https://programs.sigchi.org/chi/2023/program/content/96606) · CHI 2023 |
| Edge Revelation | 2 | Deal 8 piercing damage. Fusion pierces only if the partner has at least as much defense as attack. Apply 2 Vulnerable when fused. Material: 13 attack / 5 defense. | [Presentation of Finger-size Shapes by Combining Force Feedback and Electro-tactile Stimulation](https://ieeevr.org/2024/program/papers/) · IEEE VR 2024 |
| Hap'n'Roll | 1 | Draw 3. When fused, a non-Exhaust partner returns to your hand instead of discard, and draw 1. Material: 8 attack / 8 defense. | [Hap'n'Roll: A Scroll-inspired Device for Delivering Diverse Haptic Feedback with a Single Actuator](https://ieeevr.org/2024/program/papers/) · IEEE VR 2024 |
| Bimanual Field | 2 | Deal 6 damage and gain 6 Block. If the fusion partner attack and defense differ by at most 6, split the attack into two hits and add 6 Block. Material: 11 attack / 11 defense. | [Bimanual Ultrasound Mid-Air Haptics for Virtual Reality Manipulation](https://ieeevr.org/2025/program/papers/) · IEEE VR 2025 |
| AquaHaptics | 1 | Gain 9 Block. As material contribute 4 attack and 14 defense, then reserve half the fused shield for your next turn instead of granting it now. Material: 4 attack / 14 defense. | [AquaHaptics: Hand-based Multimodal Haptic Interactions for Immersive Virtual Underwater Experience](https://ieeevr.org/2026/program/papers/) · IEEE VR / TVCG 2026 |
| Guided Toolpath | 1 | Draw 2. Selection order guides the recipe: select this first then a defensive partner for +5 attack; otherwise gain +5 defense. Material: 12 attack / 6 defense. | [Multimodal Feedback for Handheld Tool Guidance: Combining Wrist-Based Haptics with Augmented Reality](https://ieeevr.org/2026/program/papers/) · IEEE VR 2026 |
| AttraCar Immersion | 2 | Activate cabin integration: successive fusions cycle Heat +4, airflow +1 Weak, then motion +2 × 4 Block. As material, add 4 defense. Exhaust. Material: 9 attack / 12 defense. | [AttraCar: Multisensory In-Car VR with Thermal, Airflow, and Motion Feedback through Built-In Vehicle Systems](https://scholar.gist.ac.kr/handle/local/32419) · UIST 2025 |
| Illusory Field | 1 | Evade one hit. Fusion with the same family creates a decoy; a different family creates a piercing phantom attack with +4 damage. Exhaust. Material: 6 attack / 9 defense. | [Illusory-UMH: A Systematic Comparison of Tactile Illusions and Modulation Techniques in Ultrasonic Mid-air Haptics](https://scholar.google.com/scholar?q=Illusory-UMH%3A%20A%20Systematic%20Comparison%20of%20Tactile%20Illusions%20and%20Modulation%20Techniques%20in%20Ultrasonic%20Mid-air%20Haptics) · UIST 2025 |

## HapticGeneration

| Special card | Cost | Distinctive rule (base version) | Source |
| --- | --- | --- | --- |
| HapticGen | 2 | A generated waveform turret cycles quiet → peak → tail, dealing 1×, 3×, then 1× its 3 power on successive activations. Exhaust. | [HapticGen: Generative Text-to-Vibration Model for Streamlining Haptic Design](https://doi.org/10.1145/3706598.3713609) · CHI 2025 |
| ChatHAP Revision | 1 | Choose an installed turret and a conversational edit: amplify +2, invert attack/defense roles, or preview it now at the permanent cost of 1 power. | [ChatHAP: A Chat-Based Haptic System for Designing Vibrations through Conversation](https://doi.org/10.1145/3706598.3713441) · CHI 2025 |
| Latent Denoising | 2 | Install a diffusion shield: gain its current 6 Block, then denoise +2 power each activation (cap 18). Incoming HP damage reintroduces -1 noise. Exhaust. | [HapticLDM: A Diffusion Model for Text-to-Vibrotactile Generation](https://arxiv.org/abs/2605.09971) · arXiv 2026 |
| Prompt-to-Touch | 2 | Install a two-stage pipeline: first activation prepares an audio latent; next activation converts it to 2 × 9 damage. Repeat. Exhaust. | [Prompt-to-Touch: Towards Enabling Automatic Haptic Effect Generation from Text Prompts Using Text-to-Audio Models](https://doi.org/10.1145/3819584) · ACM TOCHI 2026 |
| Perceptual Descriptors | 2 | Choose Rough (three 2-damage texture pulses), Bumpy (2 Weak + twice as much Block), or Slippery (Evasion every other activation). Exhaust. | [Generating Tactile Textures from Perceptual Descriptors with Diffusion Models: A Feasibility Study](https://doi.org/10.1145/3772363.3799381) · CHI 2026 (track unverified) |
| Text-to-Texture | 2 | Install a paired texture generator, power 4: attack cards bias it to double damage, defensive cards to double Block, other cues to both. Exhaust. | [Text-Driven Generative Framework for Multimodal Visual and Haptic Texture Synthesis](https://doi.org/10.1109/WHC64065.2025.11123227) · IEEE WHC 2025 |
| TexSenseGAN | 2 | Choose your preferred installed candidate. It gains +3 power; every other turret loses 1 power. Role caps apply. Exhaust. | [TexSenseGAN: A User-Guided System for Optimizing Texture-Related Vibrotactile Feedback Using Generative Adversarial Network](https://doi.org/10.1109/TOH.2025.3542424) · IEEE Transactions on Haptics 2025 |
| Video2Haptics | 2 | Install an event generator: fire 9 piercing damage only when the enemy intent pattern changes from the last activation. Exhaust. | [Video2Haptics: Converting Video Motion to Dynamic Haptic Feedback with Bio-Inspired Event Processing](https://doi.org/10.1109/TVCG.2024.3360468) · IEEE TVCG 2024 |
| GenTouchVR | 2 | Install scene scaffolding: with two other different turret types, queue 1 next-turn Energy; otherwise generate 4 × 1 Block. Exhaust. | [GenTouchVR: Generating a Touchable Virtual Reality Environment from a Single Image](https://doi.org/10.1109/TVCG.2026.3680620) · IEEE TVCG 2026 |
| Learned Rendering | 2 | Install a learned renderer: each newly played sensory family queues one new candidate (cap 3) for the next activation. Familiar surfaces instead build 2 × 1 Block. Exhaust. | [Development and Evaluation of a Learning-Based Model for Real-Time Haptic Texture Rendering](https://doi.org/10.1109/TOH.2024.3382258) · IEEE Transactions on Haptics 2024 |

## Writing-game humor

The Inner Editor has 20 fictional reviewer remarks across Orbit, Margins, Beams, Gravity, and Colors. The remark changes with pattern, volley, cycle, and enrage state without consuming gameplay RNG. A stable-height panel above the arena avoids moving the playfield as text wraps. Sensory Spire's final boss has four first-round and four awakened reviewer comments aligned to its four intents.

Pen shots and white proofreading ink carry cosmetic letters and paper annotations such as Fig.2, Fig.S1, [?], TODO, p<.05, et al., and 404. The original colored projectile cores and collision radii remain visible and unchanged. Blue/orange rule markers remain B/O. Critic and typo sprites also carry paper-writing labels.

## Validation

67 existing research rules tests plus 21 protocol tests (88 total) cover all 40 distinctive specials, both upgrades, routes/modules/material choices, conditional fusion, charging and event-based turrets, save migration, and rejection of malformed state. Browser checks cover free cancellation, route completion, hidden Heat relocation, returned materials, two-stage pipeline save/reload, target-specific conversational edits, preference optimization, texture/module choices, the four-field library, and 320/390px layouts. Neutral cards remain retired. Linked publisher abstracts remain unverified; the source basis is still the user-supplied summaries.
