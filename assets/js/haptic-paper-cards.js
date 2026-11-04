/* Paper-inspired game designs. Source evidence is explicit; no abstract text is fabricated. */
(function(root) {
    const papers = {
  "caress": {
    "title": "ThermoCaress: A Wearable Haptic Device with Illusory Moving Thermal Stimulation",
    "citation": "CHI 2021",
    "concept": "Pressure and temperature stimulation on the arm can create the illusion of moving warmth without physically moving the heat source.",
    "link": "https://doi.org/10.1145/3411764.3445777",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "bracelet": {
    "title": "ThermalBracelet: Exploring Thermal Haptic Feedback Around the Wrist",
    "citation": "CHI 2019",
    "concept": "Thermal feedback is explored at six locations around the wrist, informing spatial wrist-worn thermal displays.",
    "link": "https://doi.org/10.1145/3290605.3300400",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "thermovr": {
    "title": "ThermoVR: Exploring Integrated Thermal Haptic Feedback with Head Mounted Displays",
    "citation": "CHI 2017",
    "concept": "Integrating thermal feedback with a head-mounted display supports thermal experiences in virtual environments.",
    "link": "https://doi.org/10.1145/3025453.3025824",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "blox": {
    "title": "SensoryBlox: Plug-and-Feel Modular Multi-Sensory User Interface for Immersive Cardboard VR",
    "citation": "CHI 2026",
    "concept": "Modular vibration, temperature, airflow and smell components can be assembled for multisensory VR interaction.",
    "link": "https://doi.org/10.1145/3772318.3791596",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "masking2024": {
    "title": "Thermal Masking: When the Illusion Takes Over the Real",
    "citation": "CHI 2024",
    "concept": "Vibrotactile stimulation influences the perceived location of real thermal stimulation.",
    "link": "https://doi.org/10.1145/3613904.3641941",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "masking2026": {
    "title": "Thermal Masking Across the Human Body: Patterns, Pathways, and Perceptual Boundaries",
    "citation": "CHI 2026",
    "concept": "Thermal masking is compared across eight body regions, including dorsal–ventral combinations and perceptual boundaries.",
    "link": "https://doi.org/10.1145/3772318.3791601",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "electroreferral": {
    "title": "Comparing Electrical and Vibrotactile Stimulation for Thermal Referral on the Forearm",
    "citation": "CHI 2026",
    "concept": "Electrical and vibrotactile cues are compared for thermal referral on dorsal and ventral forearm sites.",
    "link": "https://scholar.gist.ac.kr/handle/local/34466",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "moisture": {
    "title": "Moisture Transfer: A Perceptual Wetness Illusion Through Thermal and Wet Integration",
    "citation": "CHI 2026",
    "concept": "Adjacent cold and moisture cues can produce perceived wetness at a location that is not physically wet.",
    "link": "https://doi.org/10.1145/3772318.3791603",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "conductivity": {
    "title": "Which is Warmer, the Cake or the Oven? Unlocking Thermal Conductivity for Virtual Reality Interaction",
    "citation": "CHI 2026",
    "concept": "Dynamic thermal changes model heat transfer and material conductivity in virtual object interaction.",
    "link": "https://doi.org/10.1145/3772318.3790864",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "avatar": {
    "title": "The Effects of Avatar and Environment on Thermal Perception and Skin Temperature in Virtual Reality",
    "citation": "CHI 2023",
    "concept": "Avatar and environmental visual features influence subjective thermal perception and skin temperature in VR.",
    "link": "https://programs.sigchi.org/chi/2023/program/content/96606",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "heatflow": {
    "title": "HeatFlow: A Thermal-Tactile Display for Dynamic 2D Thermal Movements",
    "citation": "UIST 2025",
    "concept": "Nine tactile actuators and one thermal actuator produce two-dimensional thermal motion with controlled speed and intensity.",
    "link": "https://doi.org/10.1145/3746059.3747619",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "fiery": {
    "title": "Fiery Hands: Designing Thermal Glove through Thermal and Tactile Integration for Virtual Object Manipulation",
    "citation": "UIST 2024",
    "concept": "Thermal and vibrotactile integration supports local and global warmth while minimizing obstruction of grasping surfaces.",
    "link": "https://doi.org/10.1145/3654777.3676457",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "motion": {
    "title": "Thermal In Motion: Designing Thermal Flow Illusions with Tactile and Thermal Interaction",
    "citation": "UIST 2024",
    "concept": "Thermal referral and apparent tactile motion are combined to create thermal-flow illusions.",
    "link": "https://doi.org/10.1145/3654777.3676460",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "flippelt": {
    "title": "Flip-Pelt: Motor-Driven Peltier Elements for Rapid Thermal Stimulation and Congruent Pressure Feedback in Virtual Reality",
    "citation": "UIST 2024",
    "concept": "Rotating preheated or precooled Peltier elements enables rapid thermal switching with pressure feedback.",
    "link": "https://doi.org/10.1145/3654777.3676363",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "attra": {
    "title": "AttraCar: Multisensory In-Car VR with Thermal, Airflow, and Motion Feedback through Built-In Vehicle Systems",
    "citation": "UIST 2025",
    "concept": "Vehicle HVAC and powered seats provide combined thermal, airflow and motion feedback for VR.",
    "link": "https://scholar.gist.ac.kr/handle/local/32419",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "illusory": {
    "title": "Illusory-UMH: A Systematic Comparison of Tactile Illusions and Modulation Techniques in Ultrasonic Mid-air Haptics",
    "citation": "UIST 2025",
    "concept": "Tactile illusions and modulation techniques are compared for non-contact ultrasonic haptics.",
    "link": "https://scholar.google.com/scholar?q=Illusory-UMH%3A%20A%20Systematic%20Comparison%20of%20Tactile%20Illusions%20and%20Modulation%20Techniques%20in%20Ultrasonic%20Mid-air%20Haptics",
    "linkLabel": "Find publication",
    "evidence": "provided-summary"
  },
  "grasp": {
    "title": "ThermalGrasp: Enabling Thermal Feedback even while Grasping and Walking",
    "citation": "IEEE VR 2024",
    "concept": "Heat is transferred from thermoelectric hardware on non-contact areas through thin flexible materials, preserving grasping space.",
    "link": "https://ieeevr.org/2024/program/papers/",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "shape": {
    "title": "Presentation of Finger-size Shapes by Combining Force Feedback and Electro-tactile Stimulation",
    "citation": "IEEE VR 2024",
    "concept": "Force feedback and dense electrotactile stimulation jointly convey small virtual shapes and edges.",
    "link": "https://ieeevr.org/2024/program/papers/",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "roll": {
    "title": "Hap'n'Roll: A Scroll-inspired Device for Delivering Diverse Haptic Feedback with a Single Actuator",
    "citation": "IEEE VR 2024",
    "concept": "A single actuator and scrolling-sheet mechanism convey varied fingertip forms and textures.",
    "link": "https://ieeevr.org/2024/program/papers/",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "bimanual": {
    "title": "Bimanual Ultrasound Mid-Air Haptics for Virtual Reality Manipulation",
    "citation": "IEEE VR 2025",
    "concept": "Non-coplanar ultrasonic devices deliver tactile feedback to both hands without worn hardware.",
    "link": "https://ieeevr.org/2025/program/papers/",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "aqua": {
    "title": "AquaHaptics: Hand-based Multimodal Haptic Interactions for Immersive Virtual Underwater Experience",
    "citation": "IEEE VR / TVCG 2026",
    "concept": "A hand-based multimodal interface supports haptic interaction in virtual underwater environments.",
    "link": "https://ieeevr.org/2026/program/papers/",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "chill": {
    "title": "ChillFactor: A Highly-Responsive Non-Contact Cooling Feedback Interface for VR Headsets Based on Alcohol Mist Evaporation",
    "citation": "IEEE VR 2026",
    "concept": "Alcohol-mist evaporation provides responsive non-contact cooling for VR headsets.",
    "link": "https://ieeevr.org/2026/program/papers/",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "event": {
    "title": "Event-Based Referred Vibrotactile Feedback for Bare-Hand XR Interaction",
    "citation": "IEEE VR 2026",
    "concept": "Smartwatch vibration is tied to virtual-object contact events to provide referred feedback without fingertip-mounted tactors.",
    "link": "https://ieeevr.org/2026/program/papers/",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "guidance": {
    "title": "Multimodal Feedback for Handheld Tool Guidance: Combining Wrist-Based Haptics with Augmented Reality",
    "citation": "IEEE VR 2026",
    "concept": "Wrist haptics and AR visuals guide handheld tool use while preserving free hand manipulation.",
    "link": "https://ieeevr.org/2026/program/papers/",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "stretch": {
    "title": "\"Feeling\" the Stretch: Enhancing Embodiment in Virtual Arm Elongation through Spatiotemporal Modulation of Visio-Haptic Feedback",
    "citation": "IEEE VR 2026",
    "concept": "Sequential vibration along the arm reinforces virtual arm elongation through spatial and temporal visual–haptic modulation.",
    "link": "https://ieeevr.org/2026/program/papers/",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "hapticgen": {
    "title": "HapticGen: Generative Text-to-Vibration Model for Streamlining Haptic Design",
    "citation": "CHI 2025",
    "concept": "Text prompts generate vibration waveforms using audio-derived haptic training data and expert-preference refinement.",
    "link": "https://doi.org/10.1145/3706598.3713609",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "chathap": {
    "title": "ChatHAP: A Chat-Based Haptic System for Designing Vibrations through Conversation",
    "citation": "CHI 2025",
    "concept": "An LLM supports conversational creation, editing and retrieval of vibration patterns while incorporating user preferences.",
    "link": "https://doi.org/10.1145/3706598.3713441",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "ldm": {
    "title": "HapticLDM: A Diffusion Model for Text-to-Vibrotactile Generation",
    "citation": "arXiv 2026",
    "concept": "Latent diffusion is used for text-conditioned vibration generation, targeting temporal amplitude consistency and semantic alignment.",
    "link": "https://arxiv.org/abs/2605.09971",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "prompt": {
    "title": "Prompt-to-Touch: Towards Enabling Automatic Haptic Effect Generation from Text Prompts Using Text-to-Audio Models",
    "citation": "ACM TOCHI 2026",
    "concept": "A text-to-audio pipeline converts described haptic experiences into generated audio and then haptic effects.",
    "link": "https://doi.org/10.1145/3819584",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "descriptors": {
    "title": "Generating Tactile Textures from Perceptual Descriptors with Diffusion Models: A Feasibility Study",
    "citation": "CHI 2026 (track unverified)",
    "concept": "Perceptual descriptors condition a two-stage diffusion pipeline for friction signals; the supplied summary notes limits beyond amplitude variation.",
    "link": "https://doi.org/10.1145/3772363.3799381",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "texttexture": {
    "title": "Text-Driven Generative Framework for Multimodal Visual and Haptic Texture Synthesis",
    "citation": "IEEE WHC 2025",
    "concept": "Text descriptions drive visual textures and vibrotactile synthesis through predicted surface attributes and interpolation of measured signals.",
    "link": "https://doi.org/10.1109/WHC64065.2025.11123227",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "gan": {
    "title": "TexSenseGAN: A User-Guided System for Optimizing Texture-Related Vibrotactile Feedback Using Generative Adversarial Network",
    "citation": "IEEE Transactions on Haptics 2025",
    "concept": "A generative adversarial network incorporates perceptual user judgments to optimize texture-related vibration feedback.",
    "link": "https://doi.org/10.1109/TOH.2025.3542424",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "video": {
    "title": "Video2Haptics: Converting Video Motion to Dynamic Haptic Feedback with Bio-Inspired Event Processing",
    "citation": "IEEE TVCG 2024",
    "concept": "Bio-inspired event processing maps video motion to dynamic haptic feedback.",
    "link": "https://doi.org/10.1109/TVCG.2024.3360468",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "gentouch": {
    "title": "GenTouchVR: Generating a Touchable Virtual Reality Environment from a Single Image",
    "citation": "IEEE TVCG 2026",
    "concept": "A single image and LLM-based object and physical-property inference support generated 3D scenes with force feedback.",
    "link": "https://doi.org/10.1109/TVCG.2026.3680620",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "learning": {
    "title": "Development and Evaluation of a Learning-Based Model for Real-Time Haptic Texture Rendering",
    "citation": "IEEE Transactions on Haptics 2024",
    "concept": "A learned model maps GelSight surface captures and user motion to vibration, including surfaces not used during training.",
    "link": "https://doi.org/10.1109/TOH.2024.3382258",
    "linkLabel": "Publication / source",
    "evidence": "provided-summary"
  },
  "lab_crossing": {
    "title": "Thermal Crossing: Palm-Free Thermal Rendering with Thermal Illusions",
    "citation": "ISWC 2026 · profile entry",
    "concept": "The publication title describes palm-free thermal rendering with thermal illusions.",
    "link": "https://doi.org/10.1145/3830727.3834812",
    "linkLabel": "Publication / source",
    "evidence": "profile-entry"
  },
  "lab_bow": {
    "title": "InvisiBow: Finger-Held Device for Bimanual Haptic Illusions during Virtual Archery",
    "citation": "ISWC 2025 · profile entry",
    "concept": "The publication title describes a finger-held device for bimanual haptic illusions in virtual archery.",
    "link": "https://doi.org/10.1145/3715071.3750428",
    "linkLabel": "Publication / source",
    "evidence": "profile-entry"
  },
  "lab_thermic": {
    "title": "ThermicVib: Enabling Dynamic Thermal Sensation with Multimodal Haptic Glove for Thermal-Responsive Interaction",
    "citation": "ISMAR 2024 · profile entry",
    "concept": "The publication title describes a multimodal haptic glove for dynamic thermal sensation.",
    "link": "https://thermicvib.hcitech.org/",
    "linkLabel": "Publication / source",
    "evidence": "profile-entry"
  },
  "lab_xr": {
    "title": "Adaptive and Immersive XR Interactions with Wearable Interfaces (Demo of KAIST HCI Tech Lab)",
    "citation": "CHI 2024 demo · profile entry",
    "concept": "The publication title describes adaptive immersive XR interaction with wearable interfaces.",
    "link": "https://doi.org/10.1145/3613905.3648652",
    "linkLabel": "Publication / source",
    "evidence": "profile-entry"
  }
};
    const cards = {
  "vib_event": {
    "name": "Referred Contact",
    "family": "vibration",
    "research": "event",
    "rarity": "special",
    "type": "attack",
    "cost": 1,
    "damage": 7,
    "draw": 1,
    "up": {
      "damage": 10
    },
    "text": "Deal {damage} damage. Draw {draw}.",
    "adaptation": "A remotely referred contact event becomes a precise strike that reveals the next card."
  },
  "vib_stretch": {
    "name": "Stretching Sequence",
    "family": "vibration",
    "research": "stretch",
    "rarity": "special",
    "type": "attack",
    "cost": 2,
    "damage": 3,
    "hits": 3,
    "weak": 1,
    "up": {
      "damage": 4,
      "weak": 2
    },
    "text": "Deal {damage} damage three times. Apply {weak} Weak.",
    "adaptation": "Sequential arm cues become three moving strikes that disrupt the enemy."
  },
  "vib_mask": {
    "name": "Masking Pulse",
    "family": "vibration",
    "research": "masking2024",
    "rarity": "special",
    "type": "skill",
    "cost": 1,
    "evade": 1,
    "counter": 6,
    "exhaust": true,
    "up": {
      "counter": 10
    },
    "text": "Prepare Evasion and a {counter}-damage counter. Avoid one hit; counter is reduced by enemy Block. Does not stack; strongest counter is kept. Exhaust.",
    "adaptation": "A perceptual displacement becomes concealment, evasion, and a retaliatory pulse."
  },
  "vib_boundaries": {
    "name": "Perceptual Boundaries",
    "family": "vibration",
    "research": "masking2026",
    "rarity": "special",
    "type": "skill",
    "cost": 2,
    "block": 9,
    "weak": 2,
    "up": {
      "block": 13
    },
    "text": "Gain {block} Block. Apply {weak} Weak.",
    "adaptation": "Body-site perceptual boundaries become a protective perimeter and disrupted targeting."
  },
  "vib_compare": {
    "name": "Stimulation Crossover",
    "family": "vibration",
    "research": "electroreferral",
    "rarity": "special",
    "type": "attack",
    "cost": 2,
    "damage": 5,
    "hits": 2,
    "vulnerable": 1,
    "up": {
      "damage": 7,
      "vulnerable": 2
    },
    "text": "Deal {damage} damage twice. Apply {vulnerable} Vulnerable.",
    "adaptation": "Comparing two stimulation methods becomes paired attacks exposing a weakness."
  },
  "vib_fiery": {
    "name": "Fiery Pulse",
    "family": "vibration",
    "research": "fiery",
    "rarity": "special",
    "type": "attack",
    "cost": 2,
    "damage": 4,
    "hits": 2,
    "burn": 3,
    "up": {
      "damage": 6,
      "burn": 4
    },
    "text": "Deal {damage} damage twice. Apply {burn} Heat.",
    "adaptation": "Combined vibration and warmth become two pulses with lingering thermal pressure."
  },
  "vib_prompt": {
    "name": "Prompted Resonance",
    "family": "vibration",
    "research": "hapticgen",
    "rarity": "special",
    "type": "power",
    "cost": 2,
    "strength": 2,
    "morale": 2,
    "exhaust": true,
    "up": {
      "strength": 3,
      "morale": 3
    },
    "text": "Gain {strength} Amplify and Morale for {morale} turns (+25% attack damage). Exhaust.",
    "adaptation": "Prompt-conditioned waveforms become stronger and more confident vibration attacks."
  },
  "vib_conversation": {
    "name": "Conversational Tuning",
    "family": "vibration",
    "research": "chathap",
    "rarity": "special",
    "type": "skill",
    "cost": 1,
    "draw": 3,
    "energy": 1,
    "exhaust": true,
    "up": {
      "draw": 4
    },
    "text": "Draw {draw}. Gain {energy} Energy. Exhaust.",
    "adaptation": "Conversational editing becomes rapid access to candidate signals and one extra action."
  },
  "vib_gan": {
    "name": "Texture Adversary",
    "family": "vibration",
    "research": "gan",
    "rarity": "special",
    "type": "attack",
    "cost": 1,
    "damage": 8,
    "vulnerable": 2,
    "up": {
      "damage": 11
    },
    "text": "Deal {damage} damage. Apply {vulnerable} Vulnerable.",
    "adaptation": "Perceptual optimization becomes a strike tuned to the enemy's weak point."
  },
  "vib_texture": {
    "name": "Adaptive Rendering",
    "family": "vibration",
    "research": "learning",
    "rarity": "special",
    "type": "power",
    "cost": 2,
    "armor": 2,
    "block": 4,
    "exhaust": true,
    "up": {
      "armor": 3,
      "block": 6
    },
    "text": "Gain {block} Block now and {armor} Block at the start of every turn this battle. Exhaust.",
    "adaptation": "Real-time adaptation becomes persistent defensive rendering."
  },
  "thermal_referral": {
    "name": "Thermal Referral",
    "family": "thermal",
    "research": "caress",
    "rarity": "special",
    "type": "attack",
    "cost": 2,
    "damage": 6,
    "hits": 2,
    "burn": 2,
    "up": {
      "damage": 8,
      "burn": 3
    },
    "text": "Deal {damage} thermal damage twice, then apply {burn} Heat. Amplify applies to both hits.",
    "adaptation": "Illusory moving warmth becomes two thermal strikes followed by Heat."
  },
  "thermal_masking": {
    "name": "Thermal Masking",
    "family": "thermal",
    "research": "masking2024",
    "rarity": "special",
    "type": "skill",
    "cost": 2,
    "evade": 1,
    "counter": 8,
    "exhaust": true,
    "up": {
      "counter": 12
    },
    "text": "Prepare Evasion: avoid the next incoming hit, then counter for {counter} damage. Persists until triggered. Evasion does not stack; strongest counter is kept. Exhaust.",
    "adaptation": "The supplied masking phenomenon becomes the requested one-hit evasion and counterattack."
  },
  "thermal_bracelet": {
    "name": "Six-Point Barrier",
    "family": "thermal",
    "research": "bracelet",
    "rarity": "special",
    "type": "power",
    "cost": 2,
    "block": 12,
    "armor": 1,
    "exhaust": true,
    "up": {
      "block": 16,
      "armor": 2
    },
    "text": "Gain {block} Block now and {armor} Block at the start of each turn this battle. Exhaust.",
    "adaptation": "Spatial wrist stimulation becomes a persistent defensive ring."
  },
  "thermal_vr": {
    "name": "Immersive Warmth",
    "family": "thermal",
    "research": "thermovr",
    "rarity": "special",
    "type": "skill",
    "cost": 2,
    "burn": 5,
    "morale": 2,
    "up": {
      "burn": 7,
      "morale": 3
    },
    "text": "Apply {burn} Heat. Gain Morale for {morale} turns (+25% attack damage).",
    "adaptation": "Thermal immersion becomes sustained Heat and stronger subsequent attacks."
  },
  "thermal_flow": {
    "name": "HeatFlow Sweep",
    "family": "thermal",
    "research": "heatflow",
    "rarity": "special",
    "type": "attack",
    "cost": 2,
    "damage": 3,
    "hits": 3,
    "burn": 3,
    "up": {
      "damage": 4,
      "burn": 4
    },
    "text": "Deal {damage} damage three times. Apply {burn} Heat.",
    "adaptation": "A two-dimensional thermal path becomes a sweeping triple strike."
  },
  "thermal_motion": {
    "name": "Thermal In Motion",
    "family": "thermal",
    "research": "motion",
    "rarity": "special",
    "type": "attack",
    "cost": 2,
    "damage": 5,
    "hits": 2,
    "vulnerable": 1,
    "up": {
      "damage": 7,
      "vulnerable": 2
    },
    "text": "Deal {damage} damage twice. Apply {vulnerable} Vulnerable.",
    "adaptation": "Coordinated motion and warmth become paired hits that expose the target."
  },
  "thermal_flip": {
    "name": "Flip-Pelt Switch",
    "family": "thermal",
    "research": "flippelt",
    "rarity": "special",
    "type": "skill",
    "cost": 2,
    "block": 8,
    "burn": 4,
    "up": {
      "block": 12,
      "burn": 6
    },
    "text": "Gain {block} Block. Apply {burn} Heat.",
    "adaptation": "Rapid thermal switching becomes a transition between pressure defense and thermal offense."
  },
  "thermal_grasp": {
    "name": "Unbroken Grasp",
    "family": "thermal",
    "research": "grasp",
    "rarity": "special",
    "type": "skill",
    "cost": 1,
    "block": 6,
    "draw": 2,
    "up": {
      "block": 9
    },
    "text": "Gain {block} Block. Draw {draw}.",
    "adaptation": "Preserving the grasping surface becomes defense without sacrificing available actions."
  },
  "thermal_chill": {
    "name": "ChillFactor",
    "family": "thermal",
    "research": "chill",
    "rarity": "special",
    "type": "skill",
    "cost": 1,
    "weak": 2,
    "block": 7,
    "up": {
      "weak": 3,
      "block": 10
    },
    "text": "Apply {weak} Weak. Gain {block} Block.",
    "adaptation": "Responsive cooling becomes a defensive burst that weakens the enemy."
  },
  "thermal_conduct": {
    "name": "Conductive Release",
    "family": "thermal",
    "research": "conductivity",
    "rarity": "special",
    "type": "attack",
    "cost": 1,
    "heatBurst": 2,
    "up": {
      "heatBurst": 3
    },
    "text": "Consume all enemy Heat. Deal {heatBurst} damage per Heat, bypassing Block. No Heat means no damage.",
    "adaptation": "Time-dependent heat transfer becomes a release of stored Heat; the conversion ratio is fictional."
  },
  "multi_blox": {
    "name": "SensoryBlox",
    "family": "multimodal",
    "research": "blox",
    "rarity": "special",
    "type": "skill",
    "cost": 2,
    "burn": 3,
    "block": 7,
    "draw": 1,
    "up": {
      "burn": 5,
      "block": 10
    },
    "text": "Apply {burn} Heat. Gain {block} Block. Draw {draw}.",
    "adaptation": "Three sensory modules become three coordinated benefits."
  },
  "multi_moisture": {
    "name": "Moisture Transfer",
    "family": "multimodal",
    "research": "moisture",
    "rarity": "special",
    "type": "skill",
    "cost": 1,
    "heal": 5,
    "weak": 2,
    "exhaust": true,
    "up": {
      "heal": 8
    },
    "text": "Heal {heal} HP. Apply {weak} Weak. Exhaust.",
    "adaptation": "Perceptual transfer becomes recovery for Mochi and disrupted enemy perception."
  },
  "multi_avatar": {
    "name": "Avatar Confidence",
    "family": "multimodal",
    "research": "avatar",
    "rarity": "special",
    "type": "skill",
    "cost": 1,
    "morale": 3,
    "vulnerable": 2,
    "exhaust": true,
    "up": {
      "morale": 4,
      "vulnerable": 3
    },
    "text": "Gain Morale for {morale} turns (+25% attack damage). Apply {vulnerable} Vulnerable. Exhaust.",
    "adaptation": "Visual context influencing thermal perception becomes confidence and exposed weakness."
  },
  "multi_shape": {
    "name": "Edge Revelation",
    "family": "multimodal",
    "research": "shape",
    "rarity": "special",
    "type": "attack",
    "cost": 2,
    "damage": 9,
    "pierce": true,
    "block": 4,
    "up": {
      "damage": 13,
      "block": 6
    },
    "text": "Deal {damage} damage bypassing enemy Block. Gain {block} Block.",
    "adaptation": "Aligned force and electrical edge cues become an armor-bypassing precise strike."
  },
  "multi_roll": {
    "name": "Hap'n'Roll",
    "family": "multimodal",
    "research": "roll",
    "rarity": "special",
    "type": "attack",
    "cost": 2,
    "damage": 4,
    "hits": 3,
    "draw": 1,
    "up": {
      "damage": 5,
      "draw": 2
    },
    "text": "Deal {damage} damage three times. Draw {draw}.",
    "adaptation": "One actuator rendering many patterns becomes several strikes from a single card."
  },
  "multi_bimanual": {
    "name": "Bimanual Field",
    "family": "multimodal",
    "research": "bimanual",
    "rarity": "special",
    "type": "attack",
    "cost": 2,
    "damage": 6,
    "hits": 2,
    "block": 5,
    "up": {
      "damage": 8,
      "block": 7
    },
    "text": "Deal {damage} damage twice. Gain {block} Block.",
    "adaptation": "Feedback to both hands becomes a two-sided attack and defensive field."
  },
  "multi_aqua": {
    "name": "AquaHaptics",
    "family": "multimodal",
    "research": "aqua",
    "rarity": "special",
    "type": "skill",
    "cost": 2,
    "block": 10,
    "weak": 2,
    "up": {
      "block": 15,
      "weak": 3
    },
    "text": "Gain {block} Block. Apply {weak} Weak.",
    "adaptation": "An underwater multimodal interaction becomes a protective current that slows the enemy."
  },
  "multi_guidance": {
    "name": "Guided Toolpath",
    "family": "multimodal",
    "research": "guidance",
    "rarity": "special",
    "type": "attack",
    "cost": 2,
    "damage": 7,
    "vulnerable": 2,
    "draw": 1,
    "crossBonus": 4,
    "up": {
      "damage": 10,
      "crossBonus": 6
    },
    "text": "Deal {damage} damage (+{crossBonus} if your last card this turn was another family). Apply {vulnerable} Vulnerable. Draw {draw}.",
    "adaptation": "Coordinated wrist and visual cues reward combining different card families."
  },
  "multi_attra": {
    "name": "AttraCar Immersion",
    "family": "multimodal",
    "research": "attra",
    "rarity": "special",
    "type": "power",
    "cost": 2,
    "armor": 2,
    "morale": 2,
    "exhaust": true,
    "up": {
      "armor": 3,
      "morale": 3
    },
    "text": "Gain {armor} Block each turn this battle and Morale for {morale} turns (+25% attack damage). Exhaust.",
    "adaptation": "Coordinated motion, air and heat become persistent protection and an offensive boost."
  },
  "multi_illusion": {
    "name": "Illusory Field",
    "family": "multimodal",
    "research": "illusory",
    "rarity": "special",
    "type": "skill",
    "cost": 1,
    "evade": 1,
    "draw": 2,
    "exhaust": true,
    "up": {
      "draw": 3
    },
    "text": "Prepare Evasion: avoid one hit. Draw {draw}. Evasion does not stack and keeps any prepared counter. Exhaust.",
    "adaptation": "Mid-air tactile illusions become a perceptual decoy and new tactical options."
  },
  "gen_hapticgen": {
    "name": "HapticGen",
    "family": "generation",
    "research": "hapticgen",
    "rarity": "special",
    "type": "attack",
    "cost": 2,
    "damage": 4,
    "hits": 3,
    "strength": 1,
    "up": {
      "damage": 5,
      "strength": 2
    },
    "text": "Deal {damage} damage three times, then gain {strength} Amplify.",
    "adaptation": "Generated waveform candidates become three pulses; preference refinement strengthens future signals."
  },
  "gen_chathap": {
    "name": "ChatHAP Revision",
    "family": "generation",
    "research": "chathap",
    "rarity": "special",
    "type": "skill",
    "cost": 1,
    "draw": 3,
    "weak": 1,
    "up": {
      "draw": 4,
      "weak": 2
    },
    "text": "Draw {draw}. Apply {weak} Weak.",
    "adaptation": "Conversational revision becomes new candidates and disruption of the enemy's current plan."
  },
  "gen_ldm": {
    "name": "Latent Denoising",
    "family": "generation",
    "research": "ldm",
    "rarity": "special",
    "type": "attack",
    "cost": 2,
    "block": 10,
    "damage": 7,
    "up": {
      "block": 14,
      "damage": 10
    },
    "text": "Deal {damage} damage. Gain {block} Block.",
    "adaptation": "Denoising toward temporal consistency becomes a stable attack and protective signal."
  },
  "gen_prompt": {
    "name": "Prompt-to-Touch",
    "family": "generation",
    "research": "prompt",
    "rarity": "special",
    "type": "attack",
    "cost": 2,
    "damage": 5,
    "hits": 2,
    "draw": 1,
    "up": {
      "damage": 7,
      "draw": 2
    },
    "text": "Deal {damage} damage twice. Draw {draw}.",
    "adaptation": "The text-to-audio-to-haptics pipeline becomes two linked stages and a follow-up candidate."
  },
  "gen_descriptors": {
    "name": "Perceptual Descriptors",
    "family": "generation",
    "research": "descriptors",
    "rarity": "special",
    "type": "attack",
    "cost": 1,
    "damage": 8,
    "vulnerable": 2,
    "up": {
      "damage": 11,
      "vulnerable": 3
    },
    "text": "Deal {damage} damage. Apply {vulnerable} Vulnerable.",
    "adaptation": "Descriptor-conditioned generation becomes a targeted effect, without claiming perfect perceptual control."
  },
  "gen_texture": {
    "name": "Text-to-Texture",
    "family": "generation",
    "research": "texttexture",
    "rarity": "special",
    "type": "attack",
    "cost": 2,
    "damage": 7,
    "block": 7,
    "up": {
      "damage": 11,
      "block": 11
    },
    "text": "Deal {damage} damage. Gain {block} Block.",
    "adaptation": "Joint visual and tactile synthesis becomes matching offense and defense."
  },
  "gen_gan": {
    "name": "TexSenseGAN",
    "family": "generation",
    "research": "gan",
    "rarity": "special",
    "type": "power",
    "cost": 2,
    "strength": 2,
    "block": 4,
    "exhaust": true,
    "up": {
      "strength": 3,
      "block": 7
    },
    "text": "Gain {strength} Amplify and {block} Block. Exhaust.",
    "adaptation": "User-guided optimization becomes permanent signal improvement with a defensive buffer."
  },
  "gen_video": {
    "name": "Video2Haptics",
    "family": "generation",
    "research": "video",
    "rarity": "special",
    "type": "attack",
    "cost": 2,
    "damage": 4,
    "hits": 3,
    "weak": 1,
    "up": {
      "damage": 5,
      "weak": 2
    },
    "text": "Deal {damage} damage three times. Apply {weak} Weak.",
    "adaptation": "Video motion events become a sequence of dynamic pulses."
  },
  "gen_scene": {
    "name": "GenTouchVR",
    "family": "generation",
    "research": "gentouch",
    "rarity": "special",
    "type": "power",
    "cost": 2,
    "armor": 2,
    "block": 6,
    "exhaust": true,
    "up": {
      "armor": 3,
      "block": 9
    },
    "text": "Gain {block} Block now and {armor} Block each turn this battle. Exhaust.",
    "adaptation": "Generating touchable scene structure becomes a persistent defensive environment."
  },
  "gen_learning": {
    "name": "Learned Rendering",
    "family": "generation",
    "research": "learning",
    "rarity": "special",
    "type": "attack",
    "cost": 2,
    "damage": 8,
    "draw": 2,
    "up": {
      "damage": 12,
      "draw": 3
    },
    "text": "Deal {damage} damage. Draw {draw}.",
    "adaptation": "Rendering unfamiliar textures becomes a strike that unlocks new candidates."
  },
  "neutral_crossing": {
    "name": "Thermal Crossing",
    "family": "neutral",
    "research": "lab_crossing",
    "rarity": "neutral",
    "type": "attack",
    "cost": 2,
    "damage": 5,
    "hits": 2,
    "draw": 1,
    "up": {
      "damage": 7,
      "draw": 2
    },
    "text": "Deal {damage} damage twice. Draw {draw}.",
    "adaptation": "The title's palm-free thermal illusion becomes a pair of indirect strikes and a free hand to draw."
  },
  "neutral_bow": {
    "name": "InvisiBow",
    "family": "neutral",
    "research": "lab_bow",
    "rarity": "neutral",
    "type": "attack",
    "cost": 2,
    "damage": 9,
    "evade": 1,
    "exhaust": true,
    "up": {
      "damage": 13
    },
    "text": "Deal {damage} damage. Prepare Evasion to avoid one hit. Does not stack. Exhaust.",
    "adaptation": "Bimanual archery illusion becomes an arrow-like strike and evasive repositioning."
  },
  "thermic_vib": {
    "name": "ThermicVib Fusion",
    "family": "neutral",
    "research": "lab_thermic",
    "rarity": "neutral",
    "type": "attack",
    "cost": 2,
    "damage": 7,
    "burn": 3,
    "block": 4,
    "up": {
      "damage": 10,
      "burn": 5,
      "block": 6
    },
    "text": "Deal {damage} damage, apply {burn} Heat, and gain {block} Block.",
    "adaptation": "The multimodal glove title inspires a combined impact, Heat, and defense card."
  },
  "neutral_xr": {
    "name": "Wearable Integration",
    "family": "neutral",
    "research": "lab_xr",
    "rarity": "neutral",
    "type": "skill",
    "cost": 1,
    "block": 7,
    "draw": 2,
    "up": {
      "block": 10
    },
    "text": "Gain {block} Block. Draw {draw}.",
    "adaptation": "Adaptive wearable interaction becomes flexible defense and access to more choices."
  }
};
    const catalog = { papers, cards };
    if (typeof module !== 'undefined' && module.exports) module.exports = catalog;
    else root.HapticPaperCards = catalog;
})(globalThis);
