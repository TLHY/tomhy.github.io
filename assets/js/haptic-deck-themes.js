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
      "block": 6,
      "retaliate": 4,
      "up": {
        "block": 9,
        "retaliate": 6
      },
      "text": "Gain {block} Block and {retaliate} Retaliation this turn.",
      "type": "skill",
      "adaptation": "Referred wrist contact becomes a shield that returns a pulse on real contact. Combat effects and all numeric values are fictional."
    },
    "vib_stretch": {
      "cost": 2,
      "block": 12,
      "retaliate": 5,
      "up": {
        "block": 16,
        "retaliate": 7
      },
      "text": "Gain {block} Block and {retaliate} Retaliation this turn.",
      "type": "skill",
      "adaptation": "Sequential cues along the arm become protection that responds to successive hits. Combat effects and all numeric values are fictional."
    },
    "vib_mask": {
      "cost": 1,
      "block": 5,
      "retaliate": 6,
      "up": {
        "block": 8,
        "retaliate": 9
      },
      "text": "Gain {block} Block and {retaliate} Retaliation this turn.",
      "type": "skill",
      "adaptation": "Vibration-induced thermal-location displacement becomes misdirected contact absorbed and returned by a defensive pulse. Combat effects and all numeric values are fictional."
    },
    "vib_boundaries": {
      "cost": 2,
      "block": 15,
      "retain": 15,
      "exhaust": true,
      "type": "power",
      "up": {
        "block": 20,
        "retain": 25
      },
      "text": "Gain {block} Block. Retain {retain}% more remaining Block each turn (maximum 75%). Exhaust.",
      "adaptation": "Body-site perceptual boundaries inspire a defensive perimeter that preserves remaining protection. Combat effects and all numeric values are fictional."
    },
    "vib_compare": {
      "cost": 2,
      "damage": 5,
      "shieldStrike": 1,
      "block": 4,
      "up": {
        "damage": 8,
        "block": 7
      },
      "text": "Deal {damage} damage plus current Block, then gain {block} Block.",
      "type": "attack",
      "adaptation": "Comparing electrical and vibratory cues becomes converting an existing shield signal into a precise strike. Combat effects and all numeric values are fictional."
    },
    "vib_fiery": {
      "cost": 2,
      "block": 10,
      "thorns": 2,
      "exhaust": true,
      "type": "power",
      "up": {
        "block": 14,
        "thorns": 3
      },
      "text": "Gain {block} Block and {thorns} permanent Retaliation this battle. Exhaust.",
      "adaptation": "A glove preserving grasping surfaces inspires a protective layer that repeatedly responds to contact. Combat effects and all numeric values are fictional."
    },
    "vib_prompt": {
      "cost": 2,
      "thorns": 4,
      "exhaust": true,
      "type": "power",
      "up": {
        "thorns": 6
      },
      "text": "Gain {thorns} permanent Retaliation this battle. Exhaust.",
      "adaptation": "Generated vibration waveforms become repeatable counterpulses rather than a single attack. Combat effects and all numeric values are fictional."
    },
    "vib_conversation": {
      "cost": 1,
      "block": 7,
      "draw": 2,
      "up": {
        "block": 10,
        "draw": 3
      },
      "text": "Gain {block} Block. Draw {draw}.",
      "type": "skill",
      "adaptation": "Conversational revision becomes defensive retuning and retrieval of alternative signal cards. Combat effects and all numeric values are fictional."
    },
    "vib_gan": {
      "cost": 1,
      "block": 6,
      "retaliate": 7,
      "weak": 1,
      "up": {
        "block": 9,
        "retaliate": 10
      },
      "text": "Gain {block} Block and {retaliate} Retaliation this turn. Apply {weak} Weak.",
      "type": "skill",
      "adaptation": "Preference-guided texture optimization becomes a fitted counter-response that weakens incoming attacks. Combat effects and all numeric values are fictional."
    },
    "vib_texture": {
      "cost": 2,
      "armor": 3,
      "block": 8,
      "exhaust": true,
      "type": "power",
      "up": {
        "armor": 4,
        "block": 12
      },
      "text": "Gain {block} Block now and {armor} Block at each turn start this battle. Exhaust.",
      "adaptation": "Rendering unfamiliar surfaces becomes adaptive armor that repeatedly reconstructs protection. Combat effects and all numeric values are fictional."
    },
    "thermal_referral": {
      "cost": 2,
      "damage": 3,
      "hits": 2,
      "burn": 6,
      "up": {
        "damage": 4,
        "burn": 9
      },
      "text": "Deal {damage} damage twice. Apply {burn} Heat.",
      "type": "attack",
      "adaptation": "Illusory moving warmth becomes two successive thermal contacts and a lingering Heat trace. Combat effects and all numeric values are fictional."
    },
    "thermal_masking": {
      "cost": 2,
      "evade": 1,
      "counterHeat": 7,
      "exhaust": true,
      "up": {
        "counterHeat": 11
      },
      "text": "Avoid the next incoming hit and apply {counterHeat} Heat in response. Does not stack; strongest Heat response is kept. Exhaust.",
      "type": "skill",
      "adaptation": "Thermal-location masking becomes evasion followed by a delayed thermal response instead of a physical counterattack. Combat effects and all numeric values are fictional."
    },
    "thermal_bracelet": {
      "cost": 2,
      "burn": 5,
      "block": 10,
      "up": {
        "burn": 8,
        "block": 14
      },
      "text": "Apply {burn} Heat. Gain {block} Block.",
      "type": "skill",
      "adaptation": "Distributed wrist thermodes inspire a protective ring and accumulated Heat. Combat effects and all numeric values are fictional."
    },
    "thermal_vr": {
      "cost": 2,
      "heatPower": 2,
      "exhaust": true,
      "type": "power",
      "up": {
        "heatPower": 3
      },
      "text": "Apply {heatPower} extra Heat with every Heat application this battle. Exhaust.",
      "adaptation": "Sustained thermal immersion becomes increased potency for later Heat applications. Combat effects and all numeric values are fictional."
    },
    "thermal_flow": {
      "cost": 2,
      "burn": 4,
      "heatTick": 1,
      "up": {
        "burn": 7
      },
      "text": "Apply {burn} Heat, then trigger its damage once without consuming it.",
      "type": "skill",
      "adaptation": "Controlled 2D thermal motion becomes a new Heat trace followed by an additional thermal pass. Combat effects and all numeric values are fictional."
    },
    "thermal_motion": {
      "cost": 1,
      "burn": 3,
      "heatMultiply": 50,
      "up": {
        "burn": 5,
        "heatMultiply": 75
      },
      "text": "Apply {burn} Heat, then increase the total by {heatMultiply}% (rounded down).",
      "type": "skill",
      "adaptation": "Tactile motion combined with thermal referral becomes a thermal trace that grows existing Heat. Combat effects and all numeric values are fictional."
    },
    "thermal_flip": {
      "cost": 2,
      "block": 9,
      "burn": 7,
      "weak": 1,
      "up": {
        "block": 13,
        "burn": 10
      },
      "text": "Gain {block} Block. Apply {burn} Heat and {weak} Weak.",
      "type": "skill",
      "adaptation": "Switching conditioned Peltier contact surfaces becomes a defensive pressure phase and a lasting thermal phase. Combat effects and all numeric values are fictional."
    },
    "thermal_grasp": {
      "cost": 1,
      "block": 7,
      "burn": 3,
      "draw": 1,
      "up": {
        "block": 10,
        "burn": 5
      },
      "text": "Gain {block} Block. Apply {burn} Heat. Draw {draw}.",
      "type": "skill",
      "adaptation": "An unobstructed grasp becomes maintaining protection and drawing an action while warmth persists. Combat effects and all numeric values are fictional."
    },
    "thermal_chill": {
      "cost": 1,
      "weak": 2,
      "block": 6,
      "burn": 3,
      "up": {
        "block": 9,
        "burn": 5
      },
      "text": "Apply {weak} Weak and {burn} Heat. Gain {block} Block.",
      "type": "skill",
      "adaptation": "Evaporative cooling becomes weakened attacks and protection; Heat represents a lingering thermal aftereffect. Combat effects and all numeric values are fictional."
    },
    "thermal_conduct": {
      "cost": 2,
      "heatTick": 2,
      "exhaust": true,
      "up": {
        "cost": 1
      },
      "text": "Trigger Heat damage twice without consuming Heat. Exhaust. Energy cost: {cost}.",
      "type": "skill",
      "adaptation": "Time-dependent heat transfer becomes repeated damage from stored intensity without consuming that intensity. Combat effects and all numeric values are fictional."
    },
    "multi_blox": {
      "cost": 2,
      "block": 7,
      "draw": 2,
      "fusionAttack": 8,
      "fusionBlock": 10,
      "fuseBurn": 4,
      "up": {
        "block": 10,
        "fusionAttack": 11,
        "fusionBlock": 13
      },
      "text": "Gain {block} Block. Draw {draw}. Fusion material: {fusionAttack} damage + {fusionBlock} Block. Fusing applies {fuseBurn} Heat.",
      "type": "skill",
      "adaptation": "Independent sensory modules contribute attack, defense and a thermal channel when combined as fusion materials. Combat effects and all numeric values are fictional."
    },
    "multi_moisture": {
      "cost": 1,
      "block": 6,
      "weak": 1,
      "fusionAttack": 5,
      "fusionBlock": 10,
      "fuseWeak": 2,
      "up": {
        "block": 9,
        "fusionBlock": 14
      },
      "text": "Gain {block} Block. Apply {weak} Weak. Fusion material: {fusionAttack} damage + {fusionBlock} Block. Fusing applies {fuseWeak} Weak.",
      "type": "skill",
      "adaptation": "Cold and moisture integration becomes a protective material that adds weakening specifically when fused. Combat effects and all numeric values are fictional."
    },
    "multi_avatar": {
      "cost": 1,
      "fusionPower": 3,
      "exhaust": true,
      "type": "power",
      "fusionAttack": 8,
      "fusionBlock": 8,
      "up": {
        "fusionPower": 5
      },
      "text": "All fusions gain +{fusionPower} damage and Block this battle. Exhaust. Fusion material: {fusionAttack} damage + {fusionBlock} Block.",
      "adaptation": "Visual context influencing warmth becomes a lasting increase to combined sensory recipes. Combat effects and all numeric values are fictional."
    },
    "multi_shape": {
      "cost": 2,
      "damage": 8,
      "pierce": true,
      "fusionAttack": 13,
      "fusionBlock": 5,
      "fuseVulnerable": 2,
      "up": {
        "damage": 12,
        "fusionAttack": 17
      },
      "text": "Deal {damage} damage bypassing Block. Fusion material: {fusionAttack} damage + {fusionBlock} Block. Fusing applies {fuseVulnerable} Vulnerable.",
      "type": "attack",
      "adaptation": "Aligned force and electrical edge cues become an attack-oriented material that exposes vulnerability. Combat effects and all numeric values are fictional."
    },
    "multi_roll": {
      "cost": 1,
      "draw": 3,
      "fusionAttack": 8,
      "fusionBlock": 8,
      "fuseDraw": 1,
      "up": {
        "draw": 4,
        "fusionAttack": 11,
        "fusionBlock": 11
      },
      "text": "Draw {draw}. Fusion material: {fusionAttack} damage + {fusionBlock} Block. Fusing draws {fuseDraw}.",
      "type": "skill",
      "adaptation": "One actuator expressing diverse patterns becomes a flexible material that retrieves another pattern when fused. Combat effects and all numeric values are fictional."
    },
    "multi_bimanual": {
      "cost": 2,
      "damage": 6,
      "block": 6,
      "fusionAttack": 11,
      "fusionBlock": 11,
      "up": {
        "damage": 9,
        "block": 9,
        "fusionAttack": 15,
        "fusionBlock": 15
      },
      "text": "Deal {damage} damage. Gain {block} Block. Fusion material: {fusionAttack} damage + {fusionBlock} Block.",
      "type": "attack",
      "adaptation": "Feedback to both hands becomes a balanced material contributing equal attack and protection. Combat effects and all numeric values are fictional."
    },
    "multi_aqua": {
      "cost": 1,
      "block": 9,
      "fusionAttack": 4,
      "fusionBlock": 14,
      "fuseWeak": 1,
      "up": {
        "block": 13,
        "fusionBlock": 18
      },
      "text": "Gain {block} Block. Fusion material: {fusionAttack} damage + {fusionBlock} Block. Fusing applies {fuseWeak} Weak.",
      "type": "skill",
      "adaptation": "Underwater multimodal hand interaction becomes a defensive fusion component with a weakening current. Combat effects and all numeric values are fictional."
    },
    "multi_guidance": {
      "cost": 1,
      "draw": 2,
      "vulnerable": 1,
      "fusionAttack": 12,
      "fusionBlock": 6,
      "fuseVulnerable": 2,
      "up": {
        "draw": 3,
        "fusionAttack": 16
      },
      "text": "Draw {draw}. Apply {vulnerable} Vulnerable. Fusion material: {fusionAttack} damage + {fusionBlock} Block. Fusing applies {fuseVulnerable} Vulnerable.",
      "type": "skill",
      "adaptation": "Wrist cues and AR targeting become guidance material that adds vulnerability to a fused attack. Combat effects and all numeric values are fictional."
    },
    "multi_attra": {
      "cost": 2,
      "fusionPower": 2,
      "armor": 2,
      "exhaust": true,
      "type": "power",
      "fusionAttack": 9,
      "fusionBlock": 12,
      "up": {
        "fusionPower": 3,
        "armor": 3
      },
      "text": "Gain +{fusionPower} damage and Block on fusions and {armor} Block each turn this battle. Exhaust. Fusion material: {fusionAttack} damage + {fusionBlock} Block.",
      "adaptation": "Integrated motion, airflow and temperature become persistent infrastructure strengthening future fusions and protection. Combat effects and all numeric values are fictional."
    },
    "multi_illusion": {
      "cost": 1,
      "evade": 1,
      "exhaust": true,
      "fusionAttack": 6,
      "fusionBlock": 9,
      "fuseEvade": 1,
      "up": {
        "fusionAttack": 9,
        "fusionBlock": 12
      },
      "text": "Prepare Evasion to avoid one hit. Does not stack. Exhaust. Fusion material: {fusionAttack} damage + {fusionBlock} Block. Fusing prepares Evasion.",
      "type": "skill",
      "adaptation": "Mid-air tactile illusions become a decoy component that adds Evasion when fused. Combat effects and all numeric values are fictional."
    },
    "gen_hapticgen": {
      "cost": 2,
      "install": "scatter",
      "turretPower": 3,
      "exhaust": true,
      "up": {
        "turretPower": 4
      },
      "text": "Install a Scatter turret: three hits of {turretPower} damage each turn end. Exhaust.",
      "type": "skill",
      "adaptation": "Text-conditioned vibration generation becomes an installed source emitting repeated three-pulse sequences. Combat effects and all numeric values are fictional."
    },
    "gen_chathap": {
      "cost": 1,
      "draw": 3,
      "turretBuff": 1,
      "up": {
        "draw": 4,
        "turretBuff": 2
      },
      "text": "Draw {draw}. Increase all installed turret power by {turretBuff} (role caps apply).",
      "type": "skill",
      "adaptation": "Conversation-based waveform editing becomes blueprint retrieval and firmware updates to installed generators. Combat effects and all numeric values are fictional."
    },
    "gen_ldm": {
      "cost": 2,
      "install": "shield",
      "turretPower": 10,
      "exhaust": true,
      "up": {
        "turretPower": 14
      },
      "text": "Install a Shield turret: {turretPower} Block each turn end. Exhaust.",
      "type": "skill",
      "adaptation": "Denoising toward temporally consistent signals becomes a generator repeatedly reconstructing a stable shield. Combat effects and all numeric values are fictional."
    },
    "gen_prompt": {
      "cost": 2,
      "install": "pulse",
      "turretPower": 9,
      "exhaust": true,
      "up": {
        "turretPower": 13
      },
      "text": "Install a Pulse turret: {turretPower} damage each turn end. Exhaust.",
      "type": "skill",
      "adaptation": "The text-to-audio-to-haptics pipeline becomes an installed source repeatedly emitting a generated pulse. Combat effects and all numeric values are fictional."
    },
    "gen_descriptors": {
      "cost": 2,
      "install": "suppressor",
      "turretPower": 2,
      "block": 6,
      "exhaust": true,
      "up": {
        "block": 10,
        "turretPower": 3
      },
      "text": "Gain {block} Block. Install a Suppressor applying {turretPower} Weak each turn end. Exhaust.",
      "type": "skill",
      "adaptation": "Descriptor-conditioned textures become configurable suppression; this does not imply perfect perceptual texture control. Combat effects and all numeric values are fictional."
    },
    "gen_texture": {
      "cost": 2,
      "install": "bastion",
      "turretPower": 4,
      "exhaust": true,
      "up": {
        "turretPower": 6
      },
      "text": "Install a Bastion: {turretPower} damage and {turretPower} Block each turn end. Exhaust.",
      "type": "skill",
      "adaptation": "Joint visual and tactile texture synthesis becomes a dual-purpose generator producing attack and protection together. Combat effects and all numeric values are fictional."
    },
    "gen_gan": {
      "cost": 2,
      "turretBuff": 3,
      "block": 8,
      "exhaust": true,
      "up": {
        "turretBuff": 4,
        "block": 12
      },
      "text": "Increase all installed turret power by {turretBuff} (role caps apply). Gain {block} Block. Exhaust.",
      "type": "skill",
      "adaptation": "User-guided generative optimization becomes upgrading existing turret outputs rather than creating a direct attack. Combat effects and all numeric values are fictional."
    },
    "gen_video": {
      "cost": 2,
      "install": "rail",
      "turretPower": 9,
      "exhaust": true,
      "up": {
        "turretPower": 13
      },
      "text": "Install a Rail turret: {turretPower} armor-bypassing damage each turn end. Exhaust.",
      "type": "skill",
      "adaptation": "Motion events extracted from video become precisely emitted rail events that bypass shielding. Combat effects and all numeric values are fictional."
    },
    "gen_scene": {
      "cost": 2,
      "install": "supply",
      "turretPower": 1,
      "exhaust": true,
      "up": {
        "cost": 1
      },
      "text": "Install a Supply turret: queue {turretPower} extra Energy for your next turn at each activation. Exhaust. Energy cost: {cost}.",
      "type": "skill",
      "adaptation": "Generating a touchable environment becomes a supply installation supporting later construction. Combat effects and all numeric values are fictional."
    },
    "gen_learning": {
      "cost": 2,
      "install": "recon",
      "turretPower": 1,
      "exhaust": true,
      "up": {
        "cost": 1
      },
      "text": "Install a Recon turret: queue {turretPower} extra draw for your next turn at each activation. Exhaust. Energy cost: {cost}.",
      "type": "skill",
      "adaptation": "Real-time rendering for unseen surfaces becomes recon that makes more candidate cards available. Combat effects and all numeric values are fictional."
    }
  }
};
 if (typeof module !== 'undefined' && module.exports) module.exports=config;
 else root.HapticDeckThemes=config;
})(globalThis);
