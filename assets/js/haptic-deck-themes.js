/* Gameplay identities; paper titles and evidence stay in haptic-paper-cards.js. */
(function(root) {
 const config = {
  "basics": {
    "vibration_strike": {
      "name": "Guarded Pulse",
      "cost": 1,
      "damage": 4,
      "block": 4,
      "up": {
        "damage": 6,
        "block": 6
      },
      "text": "Deal {damage} damage. Gain {block} Block.",
      "type": "attack"
    },
    "vibration_guard": {
      "name": "Damping Pad",
      "cost": 1,
      "block": 8,
      "up": {
        "block": 11
      },
      "text": "Gain {block} Block.",
      "type": "skill"
    },
    "vibration_echo": {
      "name": "Return Pulse",
      "cost": 1,
      "block": 4,
      "retaliate": 4,
      "up": {
        "block": 6,
        "retaliate": 6
      },
      "text": "Gain {block} Block and {retaliate} Retaliation until the enemy finishes acting.",
      "type": "skill"
    },
    "vibration_drive": {
      "name": "Feedback Armor",
      "cost": 1,
      "thorns": 2,
      "exhaust": true,
      "type": "power",
      "up": {
        "thorns": 3
      },
      "text": "Gain {thorns} permanent Retaliation this battle. Exhaust."
    },
    "vibration_resonance": {
      "name": "Shield Resonance",
      "cost": 2,
      "damage": 3,
      "shieldStrike": 1,
      "up": {
        "damage": 6
      },
      "text": "Deal {damage} damage plus your current Block. Block is not consumed.",
      "type": "attack"
    },
    "vibration_probe": {
      "name": "Dampening Contact",
      "cost": 1,
      "block": 5,
      "weak": 1,
      "up": {
        "block": 8
      },
      "text": "Gain {block} Block. Apply {weak} Weak.",
      "type": "skill"
    },
    "vibration_focus": {
      "name": "Resilient Rhythm",
      "cost": 1,
      "retain": 25,
      "exhaust": true,
      "type": "power",
      "up": {
        "retain": 40
      },
      "text": "Retain {retain}% more remaining Block between turns (maximum 75%). Exhaust."
    },
    "vibration_relay": {
      "name": "Defensive Relay",
      "cost": 1,
      "block": 5,
      "draw": 1,
      "up": {
        "block": 8
      },
      "text": "Gain {block} Block. Draw {draw}.",
      "type": "skill"
    },
    "vibration_disrupt": {
      "name": "Counter Calibration",
      "cost": 0,
      "retaliate": 3,
      "draw": 1,
      "exhaust": true,
      "up": {
        "retaliate": 5
      },
      "text": "Gain {retaliate} Retaliation this turn. Draw {draw}. Exhaust.",
      "type": "skill"
    },
    "vibration_retune": {
      "name": "Emergency Damping",
      "cost": 0,
      "block": 4,
      "exhaust": true,
      "up": {
        "block": 7
      },
      "text": "Gain {block} Block. Exhaust.",
      "type": "skill"
    },
    "thermal_strike": {
      "name": "Warm Contact",
      "cost": 1,
      "damage": 3,
      "burn": 3,
      "up": {
        "burn": 5
      },
      "text": "Deal {damage} damage. Apply {burn} Heat.",
      "type": "attack"
    },
    "thermal_guard": {
      "name": "Thermal Barrier",
      "cost": 1,
      "block": 6,
      "burn": 1,
      "up": {
        "block": 9,
        "burn": 2
      },
      "text": "Gain {block} Block. Apply {burn} Heat.",
      "type": "skill"
    },
    "thermal_ember": {
      "name": "Residual Warmth",
      "cost": 1,
      "burn": 5,
      "up": {
        "burn": 8
      },
      "text": "Apply {burn} Heat.",
      "type": "skill"
    },
    "thermal_cool": {
      "name": "Cooling Contact",
      "cost": 1,
      "block": 5,
      "weak": 1,
      "up": {
        "block": 8
      },
      "text": "Gain {block} Block. Apply {weak} Weak.",
      "type": "skill"
    },
    "thermal_soak": {
      "name": "Heat Soak",
      "cost": 2,
      "burn": 8,
      "block": 4,
      "up": {
        "burn": 12,
        "block": 6
      },
      "text": "Apply {burn} Heat. Gain {block} Block.",
      "type": "skill"
    },
    "thermal_insulate": {
      "name": "Thermal Memory",
      "cost": 1,
      "heatRetention": 1,
      "exhaust": true,
      "type": "power",
      "up": {
        "cost": 0
      },
      "text": "Heat no longer decays this battle. Energy cost: {cost}. Exhaust."
    },
    "thermal_monitor": {
      "name": "Temperature Scan",
      "cost": 1,
      "draw": 2,
      "burn": 2,
      "up": {
        "burn": 4
      },
      "text": "Draw {draw}. Apply {burn} Heat.",
      "type": "skill"
    },
    "thermal_focus": {
      "name": "Rising Temperature",
      "cost": 1,
      "heatPower": 1,
      "exhaust": true,
      "type": "power",
      "up": {
        "heatPower": 2
      },
      "text": "Apply {heatPower} extra Heat with each Heat application this battle. Exhaust."
    },
    "thermal_recover": {
      "name": "Cooling Interval",
      "cost": 1,
      "heal": 3,
      "block": 4,
      "exhaust": true,
      "up": {
        "heal": 5,
        "block": 6
      },
      "text": "Heal {heal} HP. Gain {block} Block. Exhaust.",
      "type": "skill"
    },
    "thermal_power": {
      "name": "Slow Release",
      "cost": 1,
      "heatTick": 1,
      "block": 3,
      "up": {
        "block": 6
      },
      "text": "Trigger Heat damage once now without consuming Heat. Gain {block} Block.",
      "type": "skill"
    },
    "multimodal_strike": {
      "name": "Impact Cue",
      "cost": 1,
      "damage": 5,
      "fusionAttack": 8,
      "fusionBlock": 2,
      "up": {
        "damage": 8,
        "fusionAttack": 11
      },
      "text": "Deal {damage} damage. Fusion material: {fusionAttack} damage + {fusionBlock} Block.",
      "type": "attack"
    },
    "multimodal_guard": {
      "name": "Protective Cue",
      "cost": 1,
      "block": 6,
      "fusionAttack": 2,
      "fusionBlock": 9,
      "up": {
        "block": 9,
        "fusionBlock": 12
      },
      "text": "Gain {block} Block. Fusion material: {fusionAttack} damage + {fusionBlock} Block.",
      "type": "skill"
    },
    "multimodal_scan": {
      "name": "Cue Alignment",
      "cost": 1,
      "draw": 2,
      "fusionAttack": 4,
      "fusionBlock": 4,
      "fuseDraw": 1,
      "up": {
        "draw": 3,
        "fusionAttack": 6
      },
      "text": "Draw {draw}. Fusion material: {fusionAttack} damage + {fusionBlock} Block. Fusing draws {fuseDraw}.",
      "type": "skill"
    },
    "multimodal_pair": {
      "name": "Paired Feedback",
      "cost": 1,
      "damage": 3,
      "block": 4,
      "fusionAttack": 6,
      "fusionBlock": 6,
      "up": {
        "damage": 5,
        "block": 6,
        "fusionAttack": 8,
        "fusionBlock": 8
      },
      "text": "Deal {damage} damage. Gain {block} Block. Fusion material: {fusionAttack} damage + {fusionBlock} Block.",
      "type": "attack"
    },
    "multimodal_warm": {
      "name": "Warm Cue",
      "cost": 1,
      "burn": 3,
      "fusionAttack": 5,
      "fusionBlock": 3,
      "fuseBurn": 3,
      "up": {
        "burn": 5,
        "fuseBurn": 5
      },
      "text": "Apply {burn} Heat. Fusion material: {fusionAttack} damage + {fusionBlock} Block. Fusing applies {fuseBurn} Heat.",
      "type": "skill"
    },
    "multimodal_gate": {
      "name": "Deflection Cue",
      "cost": 1,
      "block": 4,
      "weak": 1,
      "fusionAttack": 3,
      "fusionBlock": 7,
      "fuseWeak": 1,
      "up": {
        "block": 7,
        "fusionBlock": 10
      },
      "text": "Gain {block} Block. Apply {weak} Weak. Fusion material: {fusionAttack} damage + {fusionBlock} Block. Fusing applies {fuseWeak} Weak.",
      "type": "skill"
    },
    "multimodal_focus": {
      "name": "Fusion Focus",
      "cost": 1,
      "fusionPower": 2,
      "fusionAttack": 5,
      "fusionBlock": 5,
      "exhaust": true,
      "type": "power",
      "up": {
        "fusionPower": 3
      },
      "text": "All your fusions gain +{fusionPower} damage and Block this battle. Exhaust. Fusion material: {fusionAttack} damage + {fusionBlock} Block."
    },
    "multimodal_sync": {
      "name": "Synchronized Input",
      "cost": 0,
      "draw": 1,
      "fusionAttack": 4,
      "fusionBlock": 4,
      "exhaust": true,
      "up": {
        "draw": 2
      },
      "text": "Draw {draw}. Exhaust. Fusion material: {fusionAttack} damage + {fusionBlock} Block.",
      "type": "skill"
    },
    "multimodal_integrate": {
      "name": "Dense Signal",
      "cost": 2,
      "damage": 9,
      "block": 6,
      "fusionAttack": 12,
      "fusionBlock": 8,
      "up": {
        "damage": 13,
        "fusionAttack": 16,
        "fusionBlock": 11
      },
      "text": "Deal {damage} damage. Gain {block} Block. Fusion material: {fusionAttack} damage + {fusionBlock} Block.",
      "type": "attack"
    },
    "multimodal_retune": {
      "name": "Material Search",
      "cost": 1,
      "draw": 2,
      "block": 3,
      "fusionAttack": 3,
      "fusionBlock": 5,
      "fuseDraw": 1,
      "up": {
        "block": 6,
        "fusionBlock": 8
      },
      "text": "Draw {draw}. Gain {block} Block. Fusion material: {fusionAttack} damage + {fusionBlock} Block. Fusing draws {fuseDraw}.",
      "type": "skill"
    },
    "generation_prompt": {
      "name": "Pulse Sentry",
      "cost": 1,
      "install": "pulse",
      "turretPower": 4,
      "up": {
        "turretPower": 6
      },
      "text": "Install a Pulse turret: {turretPower} damage at every turn end.",
      "type": "skill"
    },
    "generation_guard": {
      "name": "Shield Projector",
      "cost": 1,
      "install": "shield",
      "turretPower": 5,
      "up": {
        "turretPower": 8
      },
      "text": "Install a Shield turret: {turretPower} Block at every turn end.",
      "type": "skill"
    },
    "generation_sample": {
      "name": "Blueprint Search",
      "cost": 1,
      "draw": 3,
      "up": {
        "draw": 4
      },
      "text": "Draw {draw}.",
      "type": "skill"
    },
    "generation_denoise": {
      "name": "Suppressor Sentry",
      "cost": 1,
      "install": "suppressor",
      "turretPower": 1,
      "up": {
        "turretPower": 2
      },
      "text": "Install a Suppressor: apply {turretPower} Weak at every turn end.",
      "type": "skill"
    },
    "generation_guide": {
      "name": "Rail Sentry",
      "cost": 2,
      "install": "rail",
      "turretPower": 6,
      "up": {
        "turretPower": 9
      },
      "text": "Install a Rail turret: {turretPower} damage bypassing Block at every turn end.",
      "type": "skill"
    },
    "generation_latent": {
      "name": "Firmware Update",
      "cost": 1,
      "turretBuff": 1,
      "block": 4,
      "up": {
        "turretBuff": 2,
        "block": 6
      },
      "text": "Increase every installed turret power by {turretBuff} (role caps apply). Gain {block} Block.",
      "type": "skill"
    },
    "generation_inference": {
      "name": "Emergency Cover",
      "cost": 0,
      "block": 5,
      "exhaust": true,
      "up": {
        "block": 8
      },
      "text": "Gain {block} Block. Exhaust.",
      "type": "skill"
    },
    "generation_refine": {
      "name": "Scatter Sentry",
      "cost": 2,
      "install": "scatter",
      "turretPower": 2,
      "up": {
        "turretPower": 3
      },
      "text": "Install a Scatter turret: three hits of {turretPower} damage at every turn end.",
      "type": "skill"
    },
    "generation_align": {
      "name": "Manual Trigger",
      "cost": 1,
      "triggerTurrets": 1,
      "exhaust": true,
      "up": {
        "triggerTurrets": 2
      },
      "text": "Activate all installed turrets {triggerTurrets} time(s) now. Exhaust.",
      "type": "skill"
    },
    "generation_repair": {
      "name": "Repair Station",
      "cost": 1,
      "install": "repair",
      "turretPower": 1,
      "up": {
        "turretPower": 2
      },
      "text": "Install a Repair turret: restore {turretPower} HP at every turn end.",
      "type": "skill"
    }
  },
  "specials": {
    "vib_event": {
      "cost": 1,
      "protocol": "vib_event",
      "protocolPower": 1,
      "up": {
        "protocolPower": 2
      },
      "type": "skill",
      "text": "Gain 5 Block. The next hit that meets your shield returns {protocolPower} × blocked damage as a referred counter (cap 18).",
      "adaptation": "Referred wrist contact becomes a remote counter whose amplitude is the blocked contact rather than a fixed damage bonus. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "block": 5
    },
    "vib_stretch": {
      "cost": 2,
      "protocol": "vib_stretch",
      "protocolPower": 2,
      "up": {
        "protocolPower": 3
      },
      "type": "skill",
      "text": "Gain 8 Block. The next three non-evaded hits trace a moving contact: counter {protocolPower}, twice that, then three times that.",
      "adaptation": "Sequential arm stimulation becomes three moving contact segments, with increasing return amplitudes across actual enemy hits. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "block": 8
    },
    "vib_mask": {
      "cost": 1,
      "protocol": "vib_mask",
      "protocolPower": 6,
      "up": {
        "protocolPower": 9
      },
      "type": "skill",
      "text": "Gain 3 Block. Your next hit while shielded is fully masked even if Block is too small; return a {protocolPower}-damage counter.",
      "adaptation": "A displaced perceived location becomes one contact fully hidden by an otherwise insufficient shield, followed by a return pulse. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "block": 3
    },
    "vib_boundaries": {
      "cost": 2,
      "protocol": "vib_boundaries",
      "protocolPower": 3,
      "up": {
        "protocolPower": 5
      },
      "type": "power",
      "text": "Gain 8 Block. Every fully blocked hit banks {protocolPower} Block for next turn (boundary bank cap 12). Exhaust.",
      "adaptation": "Body-site perceptual boundaries become a bank that transfers protection from a fully defended contact into the next turn. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "block": 8,
      "exhaust": true
    },
    "vib_compare": {
      "cost": 2,
      "protocol": "vib_compare",
      "protocolPower": 3,
      "up": {
        "protocolPower": 4
      },
      "type": "skill",
      "text": "If current Block meets the enemy single-hit intent, gain {protocolPower} permanent Retaliation; otherwise gain 3 × {protocolPower} Block and {protocolPower} temporary Retaliation.",
      "adaptation": "Comparing stimulation methods becomes switching between a threshold-matched sustained counter and an unmatched defensive burst. All combat rules and numbers are fictional adaptations of the supplied summary."
    },
    "vib_fiery": {
      "cost": 2,
      "protocol": "vib_fiery",
      "protocolPower": 2,
      "up": {
        "protocolPower": 3
      },
      "type": "power",
      "text": "Install contact coupling: fully blocked hits apply {protocolPower} Heat; hits that lose HP rebuild 2 × {protocolPower} Block for the following hit. Exhaust.",
      "adaptation": "Preserving a useful grasp while rendering heat becomes contact-dependent coupling: shielded contact produces warmth, damaging contact rebuilds protection. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "exhaust": true
    },
    "vib_prompt": {
      "cost": 2,
      "protocol": "vib_prompt",
      "protocolPower": 2,
      "up": {
        "protocolPower": 4
      },
      "type": "power",
      "text": "Record the next incoming non-evaded waveform (+{protocolPower} amplitude, cap 18). Replay it as a counter at each of the following two turn ends. Exhaust.",
      "adaptation": "Generated vibration waveforms become recording one enemy contact and reproducing that waveform on later turns. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "exhaust": true
    },
    "vib_conversation": {
      "cost": 1,
      "protocol": "vib_conversation",
      "protocolPower": 2,
      "up": {
        "protocolPower": 3
      },
      "type": "skill",
      "text": "Retrieve {protocolPower} defensive cards from draw/discard instead of drawing randomly. Gain 4 Block.",
      "adaptation": "Conversation-driven retrieval becomes searching for suitable defensive patterns rather than random card drawing. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "block": 4
    },
    "vib_gan": {
      "cost": 2,
      "protocol": "vib_gan",
      "protocolPower": 1,
      "up": {
        "protocolPower": 2
      },
      "type": "power",
      "text": "Learn from the enemy: losing HP adds {protocolPower} permanent Retaliation; a fully blocked hit adds 5% Block retention (cap 75%). Exhaust.",
      "adaptation": "User/perceptual feedback becomes learning different defensive improvements from unsuccessful and successful contact outcomes. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "exhaust": true
    },
    "vib_texture": {
      "cost": 2,
      "protocol": "vib_texture",
      "protocolPower": 6,
      "up": {
        "protocolPower": 9
      },
      "type": "power",
      "text": "Each previously unseen enemy intent pattern builds {protocolPower} Block before it attacks. Exhaust.",
      "adaptation": "Generalization to unfamiliar textures becomes adaptive protection that recognizes new enemy patterns and does not relearn repeats. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "exhaust": true
    },
    "thermal_referral": {
      "cost": 2,
      "protocol": "thermal_referral",
      "protocolPower": 3,
      "up": {
        "protocolPower": 5
      },
      "type": "attack",
      "text": "Deal 3 thermal damage twice and apply 4 Heat. A referred echo applies {protocolPower} more Heat at your next turn start.",
      "adaptation": "Illusory warmth moving beyond the heater becomes immediate thermal contact followed by a spatially referred echo on the next turn. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "damage": 3,
      "hits": 2,
      "burn": 4
    },
    "thermal_masking": {
      "cost": 2,
      "protocol": "thermal_masking",
      "protocolPower": 7,
      "up": {
        "protocolPower": 11
      },
      "type": "skill",
      "text": "Hide all current enemy Heat and evade one hit. On evasion, relocate the hidden Heat back onto the enemy with +{protocolPower} Heat. Exhaust.",
      "adaptation": "Masking the perceived thermal location becomes removing existing visible Heat temporarily, then relocating it after an evaded contact. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "evade": 1,
      "exhaust": true
    },
    "thermal_bracelet": {
      "cost": 2,
      "protocol": "thermal_bracelet",
      "protocolPower": 2,
      "up": {
        "protocolPower": 3
      },
      "type": "power",
      "text": "Close a six-site wrist circuit: every Heat application grants {protocolPower} Block. Every sixth application triggers a bonus Heat tick. Exhaust.",
      "adaptation": "Six physical wrist sites become a six-step thermal circuit; closing it produces an extra pass, rather than a generic shield card. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "exhaust": true
    },
    "thermal_vr": {
      "cost": 2,
      "protocol": "thermal_vr",
      "protocolPower": 50,
      "up": {
        "protocolPower": 75
      },
      "type": "power",
      "text": "Thermal presence: from the third Heat application each turn onward, add {protocolPower}% extra Heat per application. Exhaust.",
      "adaptation": "Integrated thermal immersion becomes a within-turn warm-up threshold before repeated thermal cues reinforce each other. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "exhaust": true
    },
    "thermal_flow": {
      "cost": 2,
      "protocol": "thermal_flow",
      "protocolPower": 3,
      "up": {
        "protocolPower": 4
      },
      "type": "skill",
      "text": "Choose a 2D route: Straight front-loads 2 × {protocolPower} Heat then visits two more nodes; Loop adds {protocolPower} at three turn ends and triggers three bonus Heat passes when closed.",
      "adaptation": "Two-dimensional thermal motion becomes selecting a straight path with early intensity or a closed loop with a delayed multi-pass payoff. All combat rules and numbers are fictional adaptations of the supplied summary."
    },
    "thermal_motion": {
      "cost": 2,
      "protocol": "thermal_motion",
      "protocolPower": 25,
      "up": {
        "protocolPower": 35
      },
      "type": "skill",
      "text": "The next three Heat ticks accelerate: +{protocolPower}%, twice that, then three times that. Does not consume Heat. Exhaust.",
      "adaptation": "Controllable apparent thermal speed becomes successive ticks accelerating through three intensity stages. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "exhaust": true
    },
    "thermal_flip": {
      "cost": 1,
      "protocol": "thermal_flip",
      "protocolPower": 6,
      "up": {
        "protocolPower": 9
      },
      "type": "skill",
      "text": "Alternate Peltier faces: Hot applies {protocolPower} Heat. Cold grants Block equal to Heat + {protocolPower} (cap 28) and prevents the next natural decay.",
      "adaptation": "Rotating conditioned Peltier surfaces becomes alternation between a hot output face and a protective cold face. All combat rules and numbers are fictional adaptations of the supplied summary."
    },
    "thermal_grasp": {
      "cost": 1,
      "protocol": "thermal_grasp",
      "protocolPower": 3,
      "up": {
        "protocolPower": 5
      },
      "type": "power",
      "text": "Keep grasping: the first fresh Block gain each turn applies {protocolPower} Heat without requiring another thermal card. Exhaust.",
      "adaptation": "A preserved grasping surface becomes defensive actions that maintain thermal rendering without another thermal action each time. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "exhaust": true
    },
    "thermal_chill": {
      "cost": 1,
      "protocol": "thermal_chill",
      "protocolPower": 6,
      "up": {
        "protocolPower": 9
      },
      "type": "skill",
      "text": "Evaporate up to 4 Heat. Before the next incoming hit, release {protocolPower} + 2 per evaporated Heat as Block. Apply 2 Weak.",
      "adaptation": "Evaporative cooling becomes spending stored warmth to prepare a larger delayed cooling shield. All combat rules and numbers are fictional adaptations of the supplied summary."
    },
    "thermal_conduct": {
      "cost": 2,
      "protocol": "thermal_conduct",
      "protocolPower": 2,
      "up": {
        "protocolPower": 3
      },
      "type": "skill",
      "text": "Choose material: Conductor doubles the next Heat tick then halves Heat; Insulator prevents the next {protocolPower} natural Heat decays. Exhaust.",
      "adaptation": "Different material heat-transfer behavior becomes choosing conduction with a strong but depleting pulse or insulation with preserved intensity. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "exhaust": true
    },
    "multi_blox": {
      "cost": 2,
      "protocol": "multi_blox",
      "protocolPower": 3,
      "up": {
        "protocolPower": 4
      },
      "type": "skill",
      "text": "Choose one persistent module: Heat adds 3 Heat to fusions, airflow adds 1 Weak, or scent adds 1 draw. As material, add {protocolPower} Heat with a Thermal partner, otherwise 1 Weak. Material: {fusionAttack} attack / {fusionBlock} defense.",
      "adaptation": "Modular multisensory hardware becomes choosing one persistent sensory module, with a distinct fusion channel for thermal versus other partners. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "block": 7,
      "draw": 2,
      "fusionAttack": 8,
      "fusionBlock": 10
    },
    "multi_moisture": {
      "cost": 1,
      "protocol": "multi_moisture",
      "protocolPower": 6,
      "up": {
        "protocolPower": 9
      },
      "type": "skill",
      "text": "Gain 6 Block. When fused with a thermal cue, transfer up to {protocolPower} fused attack into extra defense; otherwise the transfer does not occur. Material: {fusionAttack} attack / {fusionBlock} defense.",
      "adaptation": "Thermal/wet integration and perceptual transfer become shifting attack into protection only when a suitable thermal partner is present. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "block": 6,
      "fusionAttack": 5,
      "fusionBlock": 10
    },
    "multi_avatar": {
      "cost": 1,
      "protocol": "multi_avatar",
      "protocolPower": 4,
      "up": {
        "protocolPower": 6
      },
      "type": "power",
      "text": "Activate avatar context: every fusion boosts its dominant attack/defense value by {protocolPower}. As material, bias that fusion once. Exhaust. Material: {fusionAttack} attack / {fusionBlock} defense.",
      "adaptation": "Visual context biases the dominant perceived channel, represented by strengthening the already dominant side of a fusion. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "fusionAttack": 8,
      "fusionBlock": 8,
      "exhaust": true
    },
    "multi_shape": {
      "cost": 2,
      "protocol": "multi_shape",
      "protocolPower": 2,
      "up": {
        "protocolPower": 3,
        "fuseVulnerable": 3
      },
      "type": "skill",
      "text": "Deal 8 piercing damage. Fusion pierces only if the partner has at least as much defense as attack. Apply {protocolPower} Vulnerable when fused. Material: {fusionAttack} attack / {fusionBlock} defense.",
      "adaptation": "Force and electrical edge cues require spatial alignment, represented by armor bypass only with a defensively aligned partner. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "damage": 8,
      "pierce": true,
      "fusionAttack": 13,
      "fusionBlock": 5,
      "fuseVulnerable": 2
    },
    "multi_roll": {
      "cost": 1,
      "protocol": "multi_roll",
      "protocolPower": 1,
      "up": {
        "protocolPower": 2,
        "fuseDraw": 2
      },
      "type": "skill",
      "text": "Draw 3. When fused, a non-Exhaust partner returns to your hand instead of discard, and draw {protocolPower}. Material: {fusionAttack} attack / {fusionBlock} defense.",
      "adaptation": "One actuator reusing many tactile patterns becomes retaining a reusable partner material after a fusion instead of consuming both. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "draw": 3,
      "fusionAttack": 8,
      "fusionBlock": 8,
      "fuseDraw": 1
    },
    "multi_bimanual": {
      "cost": 2,
      "protocol": "multi_bimanual",
      "protocolPower": 6,
      "up": {
        "protocolPower": 8
      },
      "type": "skill",
      "text": "Deal 6 damage and gain 6 Block. If the fusion partner attack and defense differ by at most {protocolPower}, split the attack into two hits and add {protocolPower} Block. Material: {fusionAttack} attack / {fusionBlock} defense.",
      "adaptation": "Two-handed feedback becomes a split strike only when the partner supplies a sufficiently symmetric pair of signals. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "damage": 6,
      "block": 6,
      "fusionAttack": 11,
      "fusionBlock": 11
    },
    "multi_aqua": {
      "cost": 1,
      "protocol": "multi_aqua",
      "protocolPower": 14,
      "up": {
        "protocolPower": 18,
        "fusionBlock": 18
      },
      "type": "skill",
      "text": "Gain 9 Block. As material contribute 4 attack and {protocolPower} defense, then reserve half the fused shield for your next turn instead of granting it now. Material: {fusionAttack} attack / {fusionBlock} defense.",
      "adaptation": "Underwater interaction and buoyancy become postponing part of a combined shield to the next turn. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "block": 9,
      "fusionAttack": 4,
      "fusionBlock": 14
    },
    "multi_guidance": {
      "cost": 1,
      "protocol": "multi_guidance",
      "protocolPower": 5,
      "up": {
        "protocolPower": 8
      },
      "type": "skill",
      "text": "Draw 2. Selection order guides the recipe: select this first then a defensive partner for +{protocolPower} attack; otherwise gain +{protocolPower} defense. Material: {fusionAttack} attack / {fusionBlock} defense.",
      "adaptation": "A guided AR toolpath becomes selection-order-sensitive fusion: the intended attack-to-defense direction and reverse correction differ. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "draw": 2,
      "fusionAttack": 12,
      "fusionBlock": 6
    },
    "multi_attra": {
      "cost": 2,
      "protocol": "multi_attra",
      "protocolPower": 4,
      "up": {
        "protocolPower": 6
      },
      "type": "power",
      "text": "Activate cabin integration: successive fusions cycle Heat +{protocolPower}, airflow +1 Weak, then motion +2 × {protocolPower} Block. As material, add {protocolPower} defense. Exhaust. Material: {fusionAttack} attack / {fusionBlock} defense.",
      "adaptation": "Integrated thermal, airflow and seat-motion systems become three cabin channels cycling only when a fusion is actually executed. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "fusionAttack": 9,
      "fusionBlock": 12,
      "exhaust": true
    },
    "multi_illusion": {
      "cost": 1,
      "protocol": "multi_illusion",
      "protocolPower": 4,
      "up": {
        "protocolPower": 6
      },
      "type": "skill",
      "text": "Evade one hit. Fusion with the same family creates a decoy; a different family creates a piercing phantom attack with +{protocolPower} damage. Exhaust. Material: {fusionAttack} attack / {fusionBlock} defense.",
      "adaptation": "Coherent versus cross-modal tactile modulation becomes choosing between a same-family decoy and a cross-family phantom strike. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "evade": 1,
      "exhaust": true,
      "fusionAttack": 6,
      "fusionBlock": 9
    },
    "gen_hapticgen": {
      "cost": 2,
      "protocol": "gen_hapticgen",
      "protocolPower": 3,
      "up": {
        "protocolPower": 4,
        "turretPower": 4
      },
      "type": "skill",
      "text": "A generated waveform turret cycles quiet → peak → tail, dealing 1×, 3×, then 1× its {protocolPower} power on successive activations. Exhaust.",
      "adaptation": "A generated time-varying vibration waveform becomes a turret with quiet, peak and tail amplitudes over successive activations. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "install": "scatter",
      "turretPower": 3,
      "exhaust": true
    },
    "gen_ldm": {
      "cost": 2,
      "protocol": "gen_ldm",
      "protocolPower": 6,
      "up": {
        "protocolPower": 9,
        "turretPower": 9
      },
      "type": "skill",
      "text": "Install a diffusion shield: gain its current {protocolPower} Block, then denoise +2 power each activation (cap 18). Incoming HP damage reintroduces -1 noise. Exhaust.",
      "adaptation": "Iterative denoising toward signal consistency becomes progressive shield stabilization that is partially re-noised by damage. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "install": "shield",
      "turretPower": 6,
      "exhaust": true
    },
    "gen_prompt": {
      "cost": 2,
      "protocol": "gen_prompt",
      "protocolPower": 9,
      "up": {
        "protocolPower": 13,
        "turretPower": 13
      },
      "type": "skill",
      "text": "Install a two-stage pipeline: first activation prepares an audio latent; next activation converts it to 2 × {protocolPower} damage. Repeat. Exhaust.",
      "adaptation": "The text-to-audio-to-haptics pipeline becomes a genuine charging stage before the generated haptic output. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "install": "pulse",
      "turretPower": 9,
      "exhaust": true
    },
    "gen_descriptors": {
      "cost": 2,
      "protocol": "gen_descriptors",
      "protocolPower": 2,
      "up": {
        "protocolPower": 3,
        "turretPower": 3
      },
      "type": "skill",
      "text": "Choose Rough (three {protocolPower}-damage texture pulses), Bumpy ({protocolPower} Weak + twice as much Block), or Slippery (Evasion every other activation). Exhaust.",
      "adaptation": "Perceptual descriptors become choosing rough, bumpy or slippery programs with different behavior, without claiming perfect perceptual control. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "install": "suppressor",
      "turretPower": 2,
      "exhaust": true
    },
    "gen_texture": {
      "cost": 2,
      "protocol": "gen_texture",
      "protocolPower": 4,
      "up": {
        "protocolPower": 6,
        "turretPower": 6
      },
      "type": "skill",
      "text": "Install a paired texture generator, power {protocolPower}: attack cards bias it to double damage, defensive cards to double Block, other cues to both. Exhaust.",
      "adaptation": "Joint visual and haptic texture synthesis becomes paired outputs that follow the last visual/action cue instead of an unconditional flat output. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "install": "bastion",
      "turretPower": 4,
      "exhaust": true
    },
    "gen_video": {
      "cost": 2,
      "protocol": "gen_video",
      "protocolPower": 9,
      "up": {
        "protocolPower": 13,
        "turretPower": 13
      },
      "type": "skill",
      "text": "Install an event generator: fire {protocolPower} piercing damage only when the enemy intent pattern changes from the last activation. Exhaust.",
      "adaptation": "Bio-inspired motion-event processing becomes firing on a changed enemy intent rather than continuously firing without a new event. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "install": "rail",
      "turretPower": 9,
      "exhaust": true
    },
    "gen_scene": {
      "cost": 2,
      "protocol": "gen_scene",
      "protocolPower": 1,
      "up": {
        "protocolPower": 2,
        "turretPower": 2
      },
      "type": "skill",
      "text": "Install scene scaffolding: with two other different turret types, queue {protocolPower} next-turn Energy; otherwise generate 4 × {protocolPower} Block. Exhaust.",
      "adaptation": "Generating touchable scenes becomes building a coherent installation whose resource output depends on diverse surrounding object roles. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "install": "supply",
      "turretPower": 1,
      "exhaust": true
    },
    "gen_learning": {
      "cost": 2,
      "protocol": "gen_learning",
      "protocolPower": 1,
      "up": {
        "protocolPower": 2,
        "turretPower": 2
      },
      "type": "skill",
      "text": "Install a learned renderer: each newly played sensory family queues one new candidate (cap 3) for the next activation. Familiar surfaces instead build 2 × {protocolPower} Block. Exhaust.",
      "adaptation": "Generalization to unseen surfaces becomes detecting new sensory families for new candidates, with familiar patterns providing stable protection. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "install": "recon",
      "turretPower": 1,
      "exhaust": true
    },
    "gen_chathap": {
      "cost": 1,
      "protocol": "gen_chathap",
      "protocolPower": 2,
      "up": {
        "protocolPower": 3
      },
      "type": "skill",
      "text": "Choose an installed turret and a conversational edit: amplify +{protocolPower}, invert attack/defense roles, or preview it now at the permanent cost of 1 power.",
      "adaptation": "Conversational editing becomes selecting a live installation and issuing an amplification, inversion or preview command. All combat rules and numbers are fictional adaptations of the supplied summary."
    },
    "gen_gan": {
      "cost": 2,
      "protocol": "gen_gan",
      "protocolPower": 3,
      "up": {
        "protocolPower": 5
      },
      "type": "skill",
      "text": "Choose your preferred installed candidate. It gains +{protocolPower} power; every other turret loses 1 power. Role caps apply. Exhaust.",
      "adaptation": "User preference over generated candidates becomes selecting one turret for improvement while other candidates are reduced. All combat rules and numbers are fictional adaptations of the supplied summary.",
      "exhaust": true
    }
  }
};
 if (typeof module !== 'undefined' && module.exports) module.exports=config;
 else root.HapticDeckThemes=config;
})(globalThis);
