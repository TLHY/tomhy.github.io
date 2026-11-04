# Sensory Spire: paper-inspired cards

Four fields each have ten distinct basic cards and ten special cards. A new run starts with its ten basics; rewards offer specials and Neutral cards, with at least one card matching the starting field. Existing saved cards remain playable. There are 84 active designs: 40 basics, 40 field specials, and 4 Neutral cards.

## Evidence and scope

The user supplied the paper titles, venues, links, and summaries used for field specials. The catalog uses 35 distinct supplied paper records across 40 field specials; cross-disciplinary papers can inspire different mechanics in different fields, but each field has ten distinct paper references. The latest supplied list explicitly includes journals, WHC, and arXiv alongside CHI/UIST/IEEE VR; these entries retain their supplied venue rather than being relabeled as conference papers.

Linked abstracts and bibliographic metadata have **not been independently verified**. Direct requests to DOI, Google Scholar, and HCI Tech Lab returned proxy 403 errors. Card concepts are paraphrases of the supplied summaries, not quotations from abstracts. Game effects and all numbers are fictional adaptations. The descriptor-conditioned diffusion paper's exact CHI track is unverified.

Neutral cards currently cover the four publications already listed in this repository's profile: Thermal Crossing, InvisiBow, ThermicVib, and the CHI 2024 wearable XR demo. Their concepts are explicitly title-based. The complete https://hcitech.org/publications list has not been retrieved; do not claim complete lab coverage. The website and academic hosts are saved in the environment network draft, which still requires settings review/save and publication before access can be retried.

## Shared mechanics

- Morale increases direct card damage by 25% for its duration, multiplying Vulnerable. It refreshes to the longer duration. It does not affect Heat, heat conversion, or counterattacks.
- Evasion avoids one incoming hit without consuming Block. It persists across non-attacking turns, does not stack, and resets between battles. The strongest prepared counter is retained. Counter damage is reduced by enemy Block and a lethal counter stops remaining enemy hits.
- Conductive Release consumes all enemy Heat and deals its converted damage through Block. No Heat means zero damage; no direct-attack multipliers apply.
- Guided Toolpath gains its conditional damage bonus if the preceding card this turn belongs to a different family, including Neutral. The previous-family marker resets each turn.
- Amplify, Weak, Vulnerable, Block, draw, Energy, armor, Heat, healing, and Exhaust retain their documented behavior.

## Device relics

Geomagic Touch: first-turn Block; Novint Falcon: first-turn Energy; Haptuator: Amplify; Peltier Thermode: initial Heat; Electrotactile Array: first-turn draw; SenseGlove: healing after battle. These are fictional gameplay associations, not device performance claims. Existing relic IDs and bonuses are preserved for old saves.

## Vibration

| Card | Cost | Effect | Source |
| --- | --- | --- | --- |
| Referred Contact | 1 | Deal 7 damage. Draw 1. | [Event-Based Referred Vibrotactile Feedback for Bare-Hand XR Interaction](https://ieeevr.org/2026/program/papers/) · IEEE VR 2026 |
| Stretching Sequence | 2 | Deal 3 damage three times. Apply 1 Weak. | ["Feeling" the Stretch: Enhancing Embodiment in Virtual Arm Elongation through Spatiotemporal Modulation of Visio-Haptic Feedback](https://ieeevr.org/2026/program/papers/) · IEEE VR 2026 |
| Masking Pulse | 1 | Prepare Evasion and a 6-damage counter. Avoid one hit; counter is reduced by enemy Block. Does not stack; strongest counter is kept. Exhaust. | [Thermal Masking: When the Illusion Takes Over the Real](https://doi.org/10.1145/3613904.3641941) · CHI 2024 |
| Perceptual Boundaries | 2 | Gain 9 Block. Apply 2 Weak. | [Thermal Masking Across the Human Body: Patterns, Pathways, and Perceptual Boundaries](https://doi.org/10.1145/3772318.3791601) · CHI 2026 |
| Stimulation Crossover | 2 | Deal 5 damage twice. Apply 1 Vulnerable. | [Comparing Electrical and Vibrotactile Stimulation for Thermal Referral on the Forearm](https://scholar.gist.ac.kr/handle/local/34466) · CHI 2026 |
| Fiery Pulse | 2 | Deal 4 damage twice. Apply 3 Heat. | [Fiery Hands: Designing Thermal Glove through Thermal and Tactile Integration for Virtual Object Manipulation](https://doi.org/10.1145/3654777.3676457) · UIST 2024 |
| Prompted Resonance | 2 | Gain 2 Amplify and Morale for 2 turns (+25% attack damage). Exhaust. | [HapticGen: Generative Text-to-Vibration Model for Streamlining Haptic Design](https://doi.org/10.1145/3706598.3713609) · CHI 2025 |
| Conversational Tuning | 1 | Draw 3. Gain 1 Energy. Exhaust. | [ChatHAP: A Chat-Based Haptic System for Designing Vibrations through Conversation](https://doi.org/10.1145/3706598.3713441) · CHI 2025 |
| Texture Adversary | 1 | Deal 8 damage. Apply 2 Vulnerable. | [TexSenseGAN: A User-Guided System for Optimizing Texture-Related Vibrotactile Feedback Using Generative Adversarial Network](https://doi.org/10.1109/TOH.2025.3542424) · IEEE Transactions on Haptics 2025 |
| Adaptive Rendering | 2 | Gain 4 Block now and 2 Block at the start of every turn this battle. Exhaust. | [Development and Evaluation of a Learning-Based Model for Real-Time Haptic Texture Rendering](https://doi.org/10.1109/TOH.2024.3382258) · IEEE Transactions on Haptics 2024 |

## Thermal

| Card | Cost | Effect | Source |
| --- | --- | --- | --- |
| Thermal Referral | 2 | Deal 6 thermal damage twice, then apply 2 Heat. Amplify applies to both hits. | [ThermoCaress: A Wearable Haptic Device with Illusory Moving Thermal Stimulation](https://doi.org/10.1145/3411764.3445777) · CHI 2021 |
| Thermal Masking | 2 | Prepare Evasion: avoid the next incoming hit, then counter for 8 damage. Persists until triggered. Evasion does not stack; strongest counter is kept. Exhaust. | [Thermal Masking: When the Illusion Takes Over the Real](https://doi.org/10.1145/3613904.3641941) · CHI 2024 |
| Six-Point Barrier | 2 | Gain 12 Block now and 1 Block at the start of each turn this battle. Exhaust. | [ThermalBracelet: Exploring Thermal Haptic Feedback Around the Wrist](https://doi.org/10.1145/3290605.3300400) · CHI 2019 |
| Immersive Warmth | 2 | Apply 5 Heat. Gain Morale for 2 turns (+25% attack damage). | [ThermoVR: Exploring Integrated Thermal Haptic Feedback with Head Mounted Displays](https://doi.org/10.1145/3025453.3025824) · CHI 2017 |
| HeatFlow Sweep | 2 | Deal 3 damage three times. Apply 3 Heat. | [HeatFlow: A Thermal-Tactile Display for Dynamic 2D Thermal Movements](https://doi.org/10.1145/3746059.3747619) · UIST 2025 |
| Thermal In Motion | 2 | Deal 5 damage twice. Apply 1 Vulnerable. | [Thermal In Motion: Designing Thermal Flow Illusions with Tactile and Thermal Interaction](https://doi.org/10.1145/3654777.3676460) · UIST 2024 |
| Flip-Pelt Switch | 2 | Gain 8 Block. Apply 4 Heat. | [Flip-Pelt: Motor-Driven Peltier Elements for Rapid Thermal Stimulation and Congruent Pressure Feedback in Virtual Reality](https://doi.org/10.1145/3654777.3676363) · UIST 2024 |
| Unbroken Grasp | 1 | Gain 6 Block. Draw 2. | [ThermalGrasp: Enabling Thermal Feedback even while Grasping and Walking](https://ieeevr.org/2024/program/papers/) · IEEE VR 2024 |
| ChillFactor | 1 | Apply 2 Weak. Gain 7 Block. | [ChillFactor: A Highly-Responsive Non-Contact Cooling Feedback Interface for VR Headsets Based on Alcohol Mist Evaporation](https://ieeevr.org/2026/program/papers/) · IEEE VR 2026 |
| Conductive Release | 1 | Consume all enemy Heat. Deal 2 damage per Heat, bypassing Block. No Heat means no damage. | [Which is Warmer, the Cake or the Oven? Unlocking Thermal Conductivity for Virtual Reality Interaction](https://doi.org/10.1145/3772318.3790864) · CHI 2026 |

## Multimodal

| Card | Cost | Effect | Source |
| --- | --- | --- | --- |
| SensoryBlox | 2 | Apply 3 Heat. Gain 7 Block. Draw 1. | [SensoryBlox: Plug-and-Feel Modular Multi-Sensory User Interface for Immersive Cardboard VR](https://doi.org/10.1145/3772318.3791596) · CHI 2026 |
| Moisture Transfer | 1 | Heal 5 HP. Apply 2 Weak. Exhaust. | [Moisture Transfer: A Perceptual Wetness Illusion Through Thermal and Wet Integration](https://doi.org/10.1145/3772318.3791603) · CHI 2026 |
| Avatar Confidence | 1 | Gain Morale for 3 turns (+25% attack damage). Apply 2 Vulnerable. Exhaust. | [The Effects of Avatar and Environment on Thermal Perception and Skin Temperature in Virtual Reality](https://programs.sigchi.org/chi/2023/program/content/96606) · CHI 2023 |
| Edge Revelation | 2 | Deal 9 damage bypassing enemy Block. Gain 4 Block. | [Presentation of Finger-size Shapes by Combining Force Feedback and Electro-tactile Stimulation](https://ieeevr.org/2024/program/papers/) · IEEE VR 2024 |
| Hap'n'Roll | 2 | Deal 4 damage three times. Draw 1. | [Hap'n'Roll: A Scroll-inspired Device for Delivering Diverse Haptic Feedback with a Single Actuator](https://ieeevr.org/2024/program/papers/) · IEEE VR 2024 |
| Bimanual Field | 2 | Deal 6 damage twice. Gain 5 Block. | [Bimanual Ultrasound Mid-Air Haptics for Virtual Reality Manipulation](https://ieeevr.org/2025/program/papers/) · IEEE VR 2025 |
| AquaHaptics | 2 | Gain 10 Block. Apply 2 Weak. | [AquaHaptics: Hand-based Multimodal Haptic Interactions for Immersive Virtual Underwater Experience](https://ieeevr.org/2026/program/papers/) · IEEE VR / TVCG 2026 |
| Guided Toolpath | 2 | Deal 7 damage (+4 if your last card this turn was another family). Apply 2 Vulnerable. Draw 1. | [Multimodal Feedback for Handheld Tool Guidance: Combining Wrist-Based Haptics with Augmented Reality](https://ieeevr.org/2026/program/papers/) · IEEE VR 2026 |
| AttraCar Immersion | 2 | Gain 2 Block each turn this battle and Morale for 2 turns (+25% attack damage). Exhaust. | [AttraCar: Multisensory In-Car VR with Thermal, Airflow, and Motion Feedback through Built-In Vehicle Systems](https://scholar.gist.ac.kr/handle/local/32419) · UIST 2025 |
| Illusory Field | 1 | Prepare Evasion: avoid one hit. Draw 2. Evasion does not stack and keeps any prepared counter. Exhaust. | [Illusory-UMH: A Systematic Comparison of Tactile Illusions and Modulation Techniques in Ultrasonic Mid-air Haptics](https://scholar.google.com/scholar?q=Illusory-UMH%3A%20A%20Systematic%20Comparison%20of%20Tactile%20Illusions%20and%20Modulation%20Techniques%20in%20Ultrasonic%20Mid-air%20Haptics) · UIST 2025 |

## HapticGeneration

| Card | Cost | Effect | Source |
| --- | --- | --- | --- |
| HapticGen | 2 | Deal 4 damage three times, then gain 1 Amplify. | [HapticGen: Generative Text-to-Vibration Model for Streamlining Haptic Design](https://doi.org/10.1145/3706598.3713609) · CHI 2025 |
| ChatHAP Revision | 1 | Draw 3. Apply 1 Weak. | [ChatHAP: A Chat-Based Haptic System for Designing Vibrations through Conversation](https://doi.org/10.1145/3706598.3713441) · CHI 2025 |
| Latent Denoising | 2 | Deal 7 damage. Gain 10 Block. | [HapticLDM: A Diffusion Model for Text-to-Vibrotactile Generation](https://arxiv.org/abs/2605.09971) · arXiv 2026 |
| Prompt-to-Touch | 2 | Deal 5 damage twice. Draw 1. | [Prompt-to-Touch: Towards Enabling Automatic Haptic Effect Generation from Text Prompts Using Text-to-Audio Models](https://doi.org/10.1145/3819584) · ACM TOCHI 2026 |
| Perceptual Descriptors | 1 | Deal 8 damage. Apply 2 Vulnerable. | [Generating Tactile Textures from Perceptual Descriptors with Diffusion Models: A Feasibility Study](https://doi.org/10.1145/3772363.3799381) · CHI 2026 (track unverified) |
| Text-to-Texture | 2 | Deal 7 damage. Gain 7 Block. | [Text-Driven Generative Framework for Multimodal Visual and Haptic Texture Synthesis](https://doi.org/10.1109/WHC64065.2025.11123227) · IEEE WHC 2025 |
| TexSenseGAN | 2 | Gain 2 Amplify and 4 Block. Exhaust. | [TexSenseGAN: A User-Guided System for Optimizing Texture-Related Vibrotactile Feedback Using Generative Adversarial Network](https://doi.org/10.1109/TOH.2025.3542424) · IEEE Transactions on Haptics 2025 |
| Video2Haptics | 2 | Deal 4 damage three times. Apply 1 Weak. | [Video2Haptics: Converting Video Motion to Dynamic Haptic Feedback with Bio-Inspired Event Processing](https://doi.org/10.1109/TVCG.2024.3360468) · IEEE TVCG 2024 |
| GenTouchVR | 2 | Gain 6 Block now and 2 Block each turn this battle. Exhaust. | [GenTouchVR: Generating a Touchable Virtual Reality Environment from a Single Image](https://doi.org/10.1109/TVCG.2026.3680620) · IEEE TVCG 2026 |
| Learned Rendering | 2 | Deal 8 damage. Draw 2. | [Development and Evaluation of a Learning-Based Model for Real-Time Haptic Texture Rendering](https://doi.org/10.1109/TOH.2024.3382258) · IEEE Transactions on Haptics 2024 |

## Neutral

| Card | Cost | Effect | Source |
| --- | --- | --- | --- |
| Thermal Crossing | 2 | Deal 5 damage twice. Draw 1. | [Thermal Crossing: Palm-Free Thermal Rendering with Thermal Illusions](https://doi.org/10.1145/3830727.3834812) · ISWC 2026 · profile entry |
| InvisiBow | 2 | Deal 9 damage. Prepare Evasion to avoid one hit. Does not stack. Exhaust. | [InvisiBow: Finger-Held Device for Bimanual Haptic Illusions during Virtual Archery](https://doi.org/10.1145/3715071.3750428) · ISWC 2025 · profile entry |
| ThermicVib Fusion | 2 | Deal 7 damage, apply 3 Heat, and gain 4 Block. | [ThermicVib: Enabling Dynamic Thermal Sensation with Multimodal Haptic Glove for Thermal-Responsive Interaction](https://thermicvib.hcitech.org/) · ISMAR 2024 · profile entry |
| Wearable Integration | 1 | Gain 7 Block. Draw 2. | [Adaptive and Immersive XR Interactions with Wearable Interfaces (Demo of KAIST HCI Tech Lab)](https://doi.org/10.1145/3613905.3648652) · CHI 2024 demo · profile entry |

## Writing-game humor

The Inner Editor has 20 fictional reviewer remarks across Orbit, Margins, Beams, Gravity, and Colors. The remark changes with pattern, volley, cycle, and enrage state without consuming gameplay RNG. A stable-height panel above the arena avoids moving the playfield as text wraps. Sensory Spire's final boss has four first-round and four awakened reviewer comments aligned to its four intents.

Pen shots and white proofreading ink carry cosmetic letters and paper annotations such as Fig.2, Fig.S1, [?], TODO, p<.05, et al., and 404. The original colored projectile cores and collision radii remain visible and unchanged. Blue/orange rule markers remain B/O. Critic and typo sprites also carry paper-writing labels.

## Validation

47 research-game tests and 37 writing-game tests cover the card rules, upgrades, reward reachability, source/card counts, save migration, conditional combos, reviewer selection, and projectile metadata. Browser checks cover library filters, 40 specials and 4 Neutral cards, Heat conversion, both bosses' remarks, projectile labels, pause/resume, and 320/390px layouts. Full publisher-abstract verification and complete HCI Tech Lab coverage remain outstanding due to network access.
