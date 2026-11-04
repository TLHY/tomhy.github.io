# Sensory Spire: paper-inspired cards

Four fields each have ten distinct basic cards and ten special cards. A new run starts with its ten basics; rewards offer specials and Neutral cards, with at least one card matching the starting field. Existing saved cards remain playable. There are 84 active designs: 40 basics, 40 field specials, and 4 Neutral cards.

## Evidence and scope

The user supplied the paper titles, venues, links, and summaries used for field specials. The catalog uses 35 distinct supplied paper records across 40 field specials; cross-disciplinary papers can inspire different mechanics in different fields, but each field has ten distinct paper references. The latest supplied list explicitly includes journals, WHC, and arXiv alongside CHI/UIST/IEEE VR; these entries retain their supplied venue rather than being relabeled as conference papers.

Linked abstracts and bibliographic metadata have **not been independently verified**. Direct requests to DOI, Google Scholar, and HCI Tech Lab returned proxy 403 errors. Card concepts are paraphrases of the supplied summaries, not quotations from abstracts. Game effects and all numbers are fictional adaptations. The descriptor-conditioned diffusion paper's exact CHI track is unverified.

Neutral cards currently cover the four publications already listed in this repository's profile: Thermal Crossing, InvisiBow, ThermicVib, and the CHI 2024 wearable XR demo. Their concepts are explicitly title-based. The complete https://hcitech.org/publications list has not been retrieved; do not claim complete lab coverage. The website and academic hosts are saved in the environment network draft, which still requires settings review/save and publication before access can be retried.

## Deck identities and shared mechanics

- **Vibration — shield, tank, retaliation.** Temporary Retaliation expires after the enemy finishes acting; permanent Retaliation lasts the battle. Both respond to every non-evaded incoming hit, including fully blocked hits. A fatal hit prevents counters and counter healing. Shield strikes scale from pre-card Block without spending it. Retain carries a percentage of remaining Block into the next turn, capped at 75%, before adding armor.
- **Thermal — damage over time.** Heat bypasses Block and ticks before the enemy. Heat potency adds to each application, thermal memory prevents the normal one-stack decay, and extra ticks deal damage without spending Heat. Thermal Masking evades one hit then applies delayed Heat; legacy physical counters remain loadable but are not its current effect.
- **Multimodal — explicit two-card fusion.** Select two hand cards, preview their combined attack/Block and bonuses, then confirm for 1 Energy. Materials are discarded or exhausted; their normal play effects do not also execute. Draw resolves before materials enter discard. Multimodal starters can fuse any pair; other starters must include a selected Multimodal material. Fusion power improves both attack and defense. Cancel/reload of selection spends nothing.
- **HapticGeneration — installed turrets.** Up to three turrets persist for the encounter and activate at turn end before Heat and the enemy. Roles include Pulse, Shield, Rail, Scatter, Suppressor, Repair, Bastion, Supply, and Recon. Supply/Recon queue resources for the next turn; manual activation can trigger another cycle. Dismantling frees a slot with no card/Energy refund. Firmware caps are 20 for damage/shields, 4 for repair, and 3 for suppression/resources. Installations reset between encounters.

Paper concepts, author-supplied summaries, and source links are preserved separately from the fictional rules. The themed effects live in `assets/js/haptic-deck-themes.js`; original paper metadata lives in `haptic-paper-cards.js`. Individual card IDs, upgrades, archetypes, and relic IDs remain save-compatible; new battle fields receive safe defaults on older saves. Rebalanced card effects apply to existing card IDs as well.

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

| Card | Cost | Effect | Source |
| --- | --- | --- | --- |
| Referred Contact | 1 | Gain 6 Block and 4 Retaliation this turn. | [Event-Based Referred Vibrotactile Feedback for Bare-Hand XR Interaction](https://ieeevr.org/2026/program/papers/) · IEEE VR 2026 |
| Stretching Sequence | 2 | Gain 12 Block and 5 Retaliation this turn. | ["Feeling" the Stretch: Enhancing Embodiment in Virtual Arm Elongation through Spatiotemporal Modulation of Visio-Haptic Feedback](https://ieeevr.org/2026/program/papers/) · IEEE VR 2026 |
| Masking Pulse | 1 | Gain 5 Block and 6 Retaliation this turn. | [Thermal Masking: When the Illusion Takes Over the Real](https://doi.org/10.1145/3613904.3641941) · CHI 2024 |
| Perceptual Boundaries | 2 | Gain 15 Block. Retain 15% more remaining Block each turn (maximum 75%). Exhaust. | [Thermal Masking Across the Human Body: Patterns, Pathways, and Perceptual Boundaries](https://doi.org/10.1145/3772318.3791601) · CHI 2026 |
| Stimulation Crossover | 2 | Deal 5 damage plus current Block, then gain 4 Block. | [Comparing Electrical and Vibrotactile Stimulation for Thermal Referral on the Forearm](https://scholar.gist.ac.kr/handle/local/34466) · CHI 2026 |
| Fiery Pulse | 2 | Gain 10 Block and 2 permanent Retaliation this battle. Exhaust. | [Fiery Hands: Designing Thermal Glove through Thermal and Tactile Integration for Virtual Object Manipulation](https://doi.org/10.1145/3654777.3676457) · UIST 2024 |
| Prompted Resonance | 2 | Gain 4 permanent Retaliation this battle. Exhaust. | [HapticGen: Generative Text-to-Vibration Model for Streamlining Haptic Design](https://doi.org/10.1145/3706598.3713609) · CHI 2025 |
| Conversational Tuning | 1 | Gain 7 Block. Draw 2. | [ChatHAP: A Chat-Based Haptic System for Designing Vibrations through Conversation](https://doi.org/10.1145/3706598.3713441) · CHI 2025 |
| Texture Adversary | 1 | Gain 6 Block and 7 Retaliation this turn. Apply 1 Weak. | [TexSenseGAN: A User-Guided System for Optimizing Texture-Related Vibrotactile Feedback Using Generative Adversarial Network](https://doi.org/10.1109/TOH.2025.3542424) · IEEE Transactions on Haptics 2025 |
| Adaptive Rendering | 2 | Gain 8 Block now and 3 Block at each turn start this battle. Exhaust. | [Development and Evaluation of a Learning-Based Model for Real-Time Haptic Texture Rendering](https://doi.org/10.1109/TOH.2024.3382258) · IEEE Transactions on Haptics 2024 |

## Thermal

| Card | Cost | Effect | Source |
| --- | --- | --- | --- |
| Thermal Referral | 2 | Deal 3 damage twice. Apply 6 Heat. | [ThermoCaress: A Wearable Haptic Device with Illusory Moving Thermal Stimulation](https://doi.org/10.1145/3411764.3445777) · CHI 2021 |
| Thermal Masking | 2 | Avoid the next incoming hit and apply 7 Heat in response. Does not stack; strongest Heat response is kept. Exhaust. | [Thermal Masking: When the Illusion Takes Over the Real](https://doi.org/10.1145/3613904.3641941) · CHI 2024 |
| Six-Point Barrier | 2 | Apply 5 Heat. Gain 10 Block. | [ThermalBracelet: Exploring Thermal Haptic Feedback Around the Wrist](https://doi.org/10.1145/3290605.3300400) · CHI 2019 |
| Immersive Warmth | 2 | Apply 2 extra Heat with every Heat application this battle. Exhaust. | [ThermoVR: Exploring Integrated Thermal Haptic Feedback with Head Mounted Displays](https://doi.org/10.1145/3025453.3025824) · CHI 2017 |
| HeatFlow Sweep | 2 | Apply 4 Heat, then trigger its damage once without consuming it. | [HeatFlow: A Thermal-Tactile Display for Dynamic 2D Thermal Movements](https://doi.org/10.1145/3746059.3747619) · UIST 2025 |
| Thermal In Motion | 1 | Apply 3 Heat, then increase the total by 50% (rounded down). | [Thermal In Motion: Designing Thermal Flow Illusions with Tactile and Thermal Interaction](https://doi.org/10.1145/3654777.3676460) · UIST 2024 |
| Flip-Pelt Switch | 2 | Gain 9 Block. Apply 7 Heat and 1 Weak. | [Flip-Pelt: Motor-Driven Peltier Elements for Rapid Thermal Stimulation and Congruent Pressure Feedback in Virtual Reality](https://doi.org/10.1145/3654777.3676363) · UIST 2024 |
| Unbroken Grasp | 1 | Gain 7 Block. Apply 3 Heat. Draw 1. | [ThermalGrasp: Enabling Thermal Feedback even while Grasping and Walking](https://ieeevr.org/2024/program/papers/) · IEEE VR 2024 |
| ChillFactor | 1 | Apply 2 Weak and 3 Heat. Gain 6 Block. | [ChillFactor: A Highly-Responsive Non-Contact Cooling Feedback Interface for VR Headsets Based on Alcohol Mist Evaporation](https://ieeevr.org/2026/program/papers/) · IEEE VR 2026 |
| Conductive Release | 2 | Trigger Heat damage twice without consuming Heat. Exhaust. Energy cost: 2. | [Which is Warmer, the Cake or the Oven? Unlocking Thermal Conductivity for Virtual Reality Interaction](https://doi.org/10.1145/3772318.3790864) · CHI 2026 |

## Multimodal

| Card | Cost | Effect | Source |
| --- | --- | --- | --- |
| SensoryBlox | 2 | Gain 7 Block. Draw 2. Fusion material: 8 damage + 10 Block. Fusing applies 4 Heat. | [SensoryBlox: Plug-and-Feel Modular Multi-Sensory User Interface for Immersive Cardboard VR](https://doi.org/10.1145/3772318.3791596) · CHI 2026 |
| Moisture Transfer | 1 | Gain 6 Block. Apply 1 Weak. Fusion material: 5 damage + 10 Block. Fusing applies 2 Weak. | [Moisture Transfer: A Perceptual Wetness Illusion Through Thermal and Wet Integration](https://doi.org/10.1145/3772318.3791603) · CHI 2026 |
| Avatar Confidence | 1 | All fusions gain +3 damage and Block this battle. Exhaust. Fusion material: 8 damage + 8 Block. | [The Effects of Avatar and Environment on Thermal Perception and Skin Temperature in Virtual Reality](https://programs.sigchi.org/chi/2023/program/content/96606) · CHI 2023 |
| Edge Revelation | 2 | Deal 8 damage bypassing Block. Fusion material: 13 damage + 5 Block. Fusing applies 2 Vulnerable. | [Presentation of Finger-size Shapes by Combining Force Feedback and Electro-tactile Stimulation](https://ieeevr.org/2024/program/papers/) · IEEE VR 2024 |
| Hap'n'Roll | 1 | Draw 3. Fusion material: 8 damage + 8 Block. Fusing draws 1. | [Hap'n'Roll: A Scroll-inspired Device for Delivering Diverse Haptic Feedback with a Single Actuator](https://ieeevr.org/2024/program/papers/) · IEEE VR 2024 |
| Bimanual Field | 2 | Deal 6 damage. Gain 6 Block. Fusion material: 11 damage + 11 Block. | [Bimanual Ultrasound Mid-Air Haptics for Virtual Reality Manipulation](https://ieeevr.org/2025/program/papers/) · IEEE VR 2025 |
| AquaHaptics | 1 | Gain 9 Block. Fusion material: 4 damage + 14 Block. Fusing applies 1 Weak. | [AquaHaptics: Hand-based Multimodal Haptic Interactions for Immersive Virtual Underwater Experience](https://ieeevr.org/2026/program/papers/) · IEEE VR / TVCG 2026 |
| Guided Toolpath | 1 | Draw 2. Apply 1 Vulnerable. Fusion material: 12 damage + 6 Block. Fusing applies 2 Vulnerable. | [Multimodal Feedback for Handheld Tool Guidance: Combining Wrist-Based Haptics with Augmented Reality](https://ieeevr.org/2026/program/papers/) · IEEE VR 2026 |
| AttraCar Immersion | 2 | Gain +2 damage and Block on fusions and 2 Block each turn this battle. Exhaust. Fusion material: 9 damage + 12 Block. | [AttraCar: Multisensory In-Car VR with Thermal, Airflow, and Motion Feedback through Built-In Vehicle Systems](https://scholar.gist.ac.kr/handle/local/32419) · UIST 2025 |
| Illusory Field | 1 | Prepare Evasion to avoid one hit. Does not stack. Exhaust. Fusion material: 6 damage + 9 Block. Fusing prepares Evasion. | [Illusory-UMH: A Systematic Comparison of Tactile Illusions and Modulation Techniques in Ultrasonic Mid-air Haptics](https://scholar.google.com/scholar?q=Illusory-UMH%3A%20A%20Systematic%20Comparison%20of%20Tactile%20Illusions%20and%20Modulation%20Techniques%20in%20Ultrasonic%20Mid-air%20Haptics) · UIST 2025 |

## HapticGeneration

| Card | Cost | Effect | Source |
| --- | --- | --- | --- |
| HapticGen | 2 | Install a Scatter turret: three hits of 3 damage each turn end. Exhaust. | [HapticGen: Generative Text-to-Vibration Model for Streamlining Haptic Design](https://doi.org/10.1145/3706598.3713609) · CHI 2025 |
| ChatHAP Revision | 1 | Draw 3. Increase all installed turret power by 1 (role caps apply). | [ChatHAP: A Chat-Based Haptic System for Designing Vibrations through Conversation](https://doi.org/10.1145/3706598.3713441) · CHI 2025 |
| Latent Denoising | 2 | Install a Shield turret: 10 Block each turn end. Exhaust. | [HapticLDM: A Diffusion Model for Text-to-Vibrotactile Generation](https://arxiv.org/abs/2605.09971) · arXiv 2026 |
| Prompt-to-Touch | 2 | Install a Pulse turret: 9 damage each turn end. Exhaust. | [Prompt-to-Touch: Towards Enabling Automatic Haptic Effect Generation from Text Prompts Using Text-to-Audio Models](https://doi.org/10.1145/3819584) · ACM TOCHI 2026 |
| Perceptual Descriptors | 2 | Gain 6 Block. Install a Suppressor applying 2 Weak each turn end. Exhaust. | [Generating Tactile Textures from Perceptual Descriptors with Diffusion Models: A Feasibility Study](https://doi.org/10.1145/3772363.3799381) · CHI 2026 (track unverified) |
| Text-to-Texture | 2 | Install a Bastion: 4 damage and 4 Block each turn end. Exhaust. | [Text-Driven Generative Framework for Multimodal Visual and Haptic Texture Synthesis](https://doi.org/10.1109/WHC64065.2025.11123227) · IEEE WHC 2025 |
| TexSenseGAN | 2 | Increase all installed turret power by 3 (role caps apply). Gain 8 Block. Exhaust. | [TexSenseGAN: A User-Guided System for Optimizing Texture-Related Vibrotactile Feedback Using Generative Adversarial Network](https://doi.org/10.1109/TOH.2025.3542424) · IEEE Transactions on Haptics 2025 |
| Video2Haptics | 2 | Install a Rail turret: 9 armor-bypassing damage each turn end. Exhaust. | [Video2Haptics: Converting Video Motion to Dynamic Haptic Feedback with Bio-Inspired Event Processing](https://doi.org/10.1109/TVCG.2024.3360468) · IEEE TVCG 2024 |
| GenTouchVR | 2 | Install a Supply turret: queue 1 extra Energy for your next turn at each activation. Exhaust. Energy cost: 2. | [GenTouchVR: Generating a Touchable Virtual Reality Environment from a Single Image](https://doi.org/10.1109/TVCG.2026.3680620) · IEEE TVCG 2026 |
| Learned Rendering | 2 | Install a Recon turret: queue 1 extra draw for your next turn at each activation. Exhaust. Energy cost: 2. | [Development and Evaluation of a Learning-Based Model for Real-Time Haptic Texture Rendering](https://doi.org/10.1109/TOH.2024.3382258) · IEEE Transactions on Haptics 2024 |

## Neutral

| Card | Cost | Effect | Source |
| --- | --- | --- | --- |
| ThermicVib Fusion | 2 | Deal 7 damage, apply 3 Heat, and gain 4 Block. | [ThermicVib: Enabling Dynamic Thermal Sensation with Multimodal Haptic Glove for Thermal-Responsive Interaction](https://thermicvib.hcitech.org/) · ISMAR 2024 · profile entry |
| Thermal Crossing | 2 | Deal 5 damage twice. Draw 1. | [Thermal Crossing: Palm-Free Thermal Rendering with Thermal Illusions](https://doi.org/10.1145/3830727.3834812) · ISWC 2026 · profile entry |
| InvisiBow | 2 | Deal 9 damage. Prepare Evasion to avoid one hit. Does not stack. Exhaust. | [InvisiBow: Finger-Held Device for Bimanual Haptic Illusions during Virtual Archery](https://doi.org/10.1145/3715071.3750428) · ISWC 2025 · profile entry |
| Wearable Integration | 1 | Gain 7 Block. Draw 2. | [Adaptive and Immersive XR Interactions with Wearable Interfaces (Demo of KAIST HCI Tech Lab)](https://doi.org/10.1145/3613905.3648652) · CHI 2024 demo · profile entry |

## Writing-game humor

The Inner Editor has 20 fictional reviewer remarks across Orbit, Margins, Beams, Gravity, and Colors. The remark changes with pattern, volley, cycle, and enrage state without consuming gameplay RNG. A stable-height panel above the arena avoids moving the playfield as text wraps. Sensory Spire's final boss has four first-round and four awakened reviewer comments aligned to its four intents.

Pen shots and white proofreading ink carry cosmetic letters and paper annotations such as Fig.2, Fig.S1, [?], TODO, p<.05, et al., and 404. The original colored projectile cores and collision radii remain visible and unchanged. Blue/orange rule markers remain B/O. Critic and typo sprites also carry paper-writing labels.

## Validation

66 research-game rules tests cover all 80 field cards and four Neutral cards, source counts, save migration, Heat stacking/retention, multi-hit retaliation, lethal hits, two-card fusion atomicity, material draw order, turret roles/caps/queues, dismantling, device bonuses, and encounter reset. Browser checks cover fusion selection/preview/cancel/confirm, full installation slots, dismantling, automatic turret activation, reload, delayed Heat, counters, and mobile layouts at 320/390px. The existing 37 writing-game tests cover reviewer lines and projectile labels; writing gameplay is unchanged by this deck rework. Publisher abstract verification and complete HCI Tech Lab coverage remain outstanding due to network access.
