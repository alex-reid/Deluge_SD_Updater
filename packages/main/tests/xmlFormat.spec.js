import {expect, test} from 'vitest';
import beautifyXML from '../src/delugefs/beautifyXML';

const dummyXML = `<?xml version="1.0" encoding="UTF-8"?>
<song firmwareVersion="3.1.5" earliestCompatibleFirmware="3.1.0-beta" previewNumPads="144" preview="000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002ED1020B2C09F600043302002ED109F600043302022F0819E600073002002ED119E600073002002ED109F600043302FF0000B0004FDA25002E09020009F60204331200ED0602320009F6020433DA25002E09020009F60204331200ED0602320009F602043300FF06B0004FDA250000000000E21D0000001200ED00000000E21D000000DA250000000000E21D0000001200ED00000000E21D000000FF0000005AA5006D92006D92006D92006D92006D92006D92006D92006D92006D92006D92006D92006D92006D92006D92006D9247584CFF0000005AA5F0000F320205000000F0000F320205000000F0000F320205000000F0000FB0004F92006D60009F150222F0000F32020500FF06B0004FF0000F320205000000F0000F320205000000F0000F320205000000F0000F320205000000F0000F320205F0000F320205FF0000005AA5" arrangementAutoScrollOn="0" xScroll="1152" xZoom="24" yScrollSongView="-2" yScrollArrangementView="-3" xScrollArrangementView="0" xZoomArrangementView="192" timePerTimerTick="218" timerTickFraction="-1073741824" rootNote="0" inputTickMagnitude="2" swingAmount="2" swingInterval="7" affectEntire="0" activeModFunction="1" lpfMode="24dB" modFXType="flanger" modFXCurrentParam="feedback" currentFilterType="lpf">
	<modeNotes>
		<modeNote>0</modeNote>
		<modeNote>2</modeNote>
		<modeNote>4</modeNote>
		<modeNote>6</modeNote>
		<modeNote>7</modeNote>
		<modeNote>9</modeNote>
		<modeNote>11</modeNote>
	</modeNotes>
	<reverb roomSize="1288490496" dampening="1546188288" width="2147483647" pan="0">
		<compressor attack="327244" release="936" volume="-21474836" shape="-601295438" syncLevel="6"/>
	</reverb>
	<delay pingPong="1" analog="0" syncLevel="7"/>
	<compressor syncLevel="7" attack="327244" release="936"/>
	<songParams reverbAmount="0x80000000" volume="0x3504F334" pan="0x00000000" sidechainCompressorShape="0xDC28F5B2" modFXDepth="0x00000000" modFXRate="0xE0000000" stutterRate="0x00000000" sampleRateReduction="0x80000000" bitCrush="0x80000000" modFXOffset="0x00000000" modFXFeedback="0x80000000">
		<delay rate="0x00000000" feedback="0x80000000"/>
		<lpf frequency="0x7FFFFFFF" resonance="0x80000000"/>
		<hpf frequency="0x80000000" resonance="0x80000000"/>
		<equalizer bass="0x00000000" treble="0x00000000" bassFrequency="0x00000000" trebleFrequency="0x00000000"/>
	</songParams>
	<instruments>
		<sound presetName="M1 Piano" defaultVelocity="64" isArmedForRecording="0" activeModFunction="1" inputMidiChannel="2" polyphonic="poly" voicePriority="1" mode="subtractive" lpfMode="24dB" modFXType="none" presetFolder="SYNTHS">
			<osc1 type="sample" loopMode="0" reversed="0" timeStretchEnable="0" timeStretchAmount="0">
				<sampleRanges>
					<sampleRange rangeTopNote="27" fileName="SAMPLES/ALEX/MULTISAMPLES/M1piano/M1_Piano_C0.wav" transpose="36">
						<zone startSamplePos="0" endSamplePos="436383"/>
					</sampleRange>
				</sampleRanges>
			</osc1>
			<osc2 type="square" transpose="0" cents="0" retrigPhase="-1"/>
			<lfo1 type="triangle" syncLevel="0"/>
			<lfo2 type="triangle"/>
			<unison num="1" detune="8"/>
			<delay pingPong="1" analog="0" syncLevel="7"/>
			<compressor syncLevel="7" attack="327244" release="936"/>
			<modKnobs>
				<modKnob controlsParam="pan"/>
			</modKnobs>
		</sound>
		<kit presetName="Tr8" defaultVelocity="65" isArmedForRecording="0" activeModFunction="1" lpfMode="24dB" modFXType="flanger" modFXCurrentParam="feedback" currentFilterType="lpf" presetFolder="KITS">
			<delay pingPong="1" analog="0" syncLevel="7"/>
			<compressor syncLevel="7" attack="327244" release="936"/>
			<soundSources>
				<midiOutput channel="9" note="36">
				</midiOutput>
			</soundSources>
			<selectedDrumIndex>3</selectedDrumIndex>
		</kit>
		<midiChannel channel="3" suffix="-1" defaultVelocity="64" isArmedForRecording="0" activeModFunction="0"/>
	</instruments>
	<sections>
		<section id="0" numRepeats="0"/>
		<section id="1" numRepeats="0"/>
		<section id="2" numRepeats="0"/>
		<section id="3" numRepeats="0"/>
		<section id="4" numRepeats="0"/>
		<section id="5" numRepeats="0"/>
		<section id="6" numRepeats="0"/>
		<section id="7" numRepeats="0"/>
		<section id="8" numRepeats="0"/>
		<section id="9" numRepeats="0"/>
		<section id="10" numRepeats="0"/>
		<section id="11" numRepeats="0"/>
	</sections>
	<sessionClips>
		<instrumentClip inKeyMode="1" yScroll="38" yScrollKeyboard="50" instrumentPresetName="M1 Piano" isPlaying="0" isSoloing="0" isArmedForRecording="1" length="1536" colourOffset="49" section="1" instrumentPresetFolder="SYNTHS">
			<soundParams arpeggiatorGate="0x00000000" portamento="0x80000000" compressorShape="0xDC28F5B2" oscAVolume="0x7FFFFFFF" oscAPulseWidth="0x00000000" oscBVolume="0x80000000" oscBPulseWidth="0x00000000" noiseVolume="0x80000000" volume="0xD6000000" pan="0x00000000" lpfFrequency="0x7FFFFFFF" lpfResonance="0x80000000" hpfFrequency="0xCE000000" hpfResonance="0x80000000" lfo1Rate="0x1999997E" lfo2Rate="0x00000000" modulator1Amount="0x80000000" modulator1Feedback="0x80000000" modulator2Amount="0x80000000" modulator2Feedback="0x80000000" carrier1Feedback="0x80000000" carrier2Feedback="0x80000000" modFXRate="0x00000000" modFXDepth="0x00000000" delayRate="0x00000000" delayFeedback="0x80000000" reverbAmount="0x12000000" arpeggiatorRate="0x00000000" stutterRate="0x00000000" sampleRateReduction="0x80000000" bitCrush="0x80000000" modFXOffset="0x00000000" modFXFeedback="0x00000000">
				<envelope1 attack="0x80000000" decay="0xE6666654" sustain="0x7FFFFFFF" release="0xB333332A"/>
				<envelope2 attack="0xE6666654" decay="0xE6666654" sustain="0xFFFFFFE9" release="0xE6666654"/>
				<patchCables>
					<patchCable source="velocity" destination="volume" amount="0x3FFFFFE8"/>
				</patchCables>
				<equalizer bass="0x00000000" treble="0x00000000" bassFrequency="0x00000000" trebleFrequency="0x00000000"/>
			</soundParams>
			<noteRows>
				<noteRow y="52" noteData="0x000003000000003C661400000360000000236614000003A8000000234014000003F000000022601400000438000000205A14"/>
				<noteRow y="54" noteData="0x000004800000003B6314000004E00000002A6F14000005280000002D6F1400000570000000276F14000005B8000000275714"/>
				<noteRow y="57" noteData="0x000001800000003A5A14000001E00000001E60140000022800000021481400000270000000205A14000002B8000000236014"/>
				<noteRow y="59" noteData="0x000000000000003A5A1400000060000000206014000000A80000001E5414000000F00000001D5014000001380000001E5414"/>
				<noteRow y="64" noteData="0x000003300000002E6014000003780000002D5414000003C0000000325A14000004080000002E541400000450000000255414"/>
				<noteRow y="66" noteData="0x000004B00000002D6314000004F8000000346314000005400000002A6314000005880000002D6314000005D0000000236F14"/>
				<noteRow y="67" noteData="0x0000033000000030401400000378000000304014000003C00000003040140000040800000030401400000450000000304014"/>
				<noteRow y="69" noteData="0x000001B00000002E6614000001F8000000295A14000002400000002C601400000288000000285A14000002D00000001F6014"/>
				<noteRow y="71" noteData="0x00000030000000256014000000780000002D5014000000C00000002C5414000001080000002F5A140000033000000030401400000378000000304014000003C00000003040140000040800000030401400000450000000304014000004B0000000304014000004F80000003040140000054000000030401400000588000000304014000005D0000000304014"/>
				<noteRow y="72"/>
				<noteRow y="74" noteData="0x0000003000000030401400000078000000304014000000C00000003040140000010800000030401400000150000000304014000001B0000000304014000001F80000003040140000024000000030401400000288000000304014000002D0000000304014000004B0000000304014000004F8000000304014000005D0000000304014"/>
				<noteRow y="76" noteData="0x0000054000000030401400000588000000304014"/>
				<noteRow y="78" noteData="0x0000003000000030401400000078000000184014000000C00000003040140000010800000030401400000150000000304014000001B0000000304014000001F800000030401400000240000000304014"/>
				<noteRow y="79" noteData="0x00000288000000304014000002D0000000304014"/>
				<noteRow y="81" noteData="0x00000150000000304014"/>
			</noteRows>
		</instrumentClip>
		<instrumentClip inKeyMode="1" yScroll="1" yScrollKeyboard="50" affectEntire="0" instrumentPresetName="Tr8" isPlaying="1" isSoloing="0" isArmedForRecording="1" length="768" colourOffset="44" section="1" instrumentPresetFolder="KITS">
			<kitParams reverbAmount="0x80000000" volume="0x3504F334" pan="0x00000000" sidechainCompressorShape="0xDC28F5B2" modFXDepth="0x00000000" modFXRate="0xE0000000" stutterRate="0x00000000" sampleRateReduction="0x80000000" bitCrush="0x80000000" modFXOffset="0x00000000" modFXFeedback="0x80000000">
				<delay rate="0x00000000" feedback="0x80000000"/>
				<lpf frequency="0x7FFFFFFF" resonance="0x80000000"/>
				<hpf frequency="0x80000000" resonance="0x80000000"/>
				<equalizer bass="0x00000000" treble="0x00000000" bassFrequency="0x00000000" trebleFrequency="0x00000000"/>
			</kitParams>
			<noteRows>
				<noteRow colourOffset="22" noteData="0x0000000000000030411400000060000000304114000000C00000003041140000012000000030411400000180000000304114000001E000000030411400000240000000304114000002A0000000304114000002D0000000304114" drumIndex="0"/>
			</noteRows>
		</instrumentClip>
		<instrumentClip inKeyMode="1" yScroll="0" yScrollKeyboard="50" affectEntire="0" isPlaying="0" isSoloing="0" isArmedForRecording="1" length="768" colourOffset="44" section="0" instrumentPresetName="003 TR-909" instrumentPresetFolder="KITS">
			<kitParams reverbAmount="0x80000000" volume="0x3504F334" pan="0x00000000" sidechainCompressorShape="0xDC28F5B2" modFXDepth="0x00000000" modFXRate="0xE0000000" stutterRate="0x00000000" sampleRateReduction="0x80000000" bitCrush="0x80000000" modFXOffset="0x00000000" modFXFeedback="0x80000000">
				<delay rate="0x00000000" feedback="0x80000000"/>
				<lpf frequency="0x7FFFFFFF" resonance="0x80000000"/>
				<hpf frequency="0x80000000" resonance="0xC0000000"/>
				<equalizer bass="0x00000000" treble="0x00000000" bassFrequency="0x00000000" trebleFrequency="0x00000000"/>
			</kitParams>
			<noteRows>
				<noteRow colourOffset="22" noteData="0x0000000000000030411400000060000000304114000000C00000003041140000012000000030411400000180000000304114000001E000000030411400000240000000304114000002A0000000304114000002D0000000304114" drumIndex="0">
					<soundParams arpeggiatorGate="0x00000000" portamento="0x80000000" compressorShape="0xDC28F5B2" oscAVolume="0x7FFFFFFF" oscAPulseWidth="0x00000000" oscBVolume="0x80000000" oscBPulseWidth="0x00000000" noiseVolume="0x80000000" volume="0x2E147AC2" pan="0x00000000" lpfFrequency="0x7FFFFFFF" lpfResonance="0x80000000" hpfFrequency="0x80000000" hpfResonance="0x80000000" lfo1Rate="0x1999997E" lfo2Rate="0x00000000" modulator1Amount="0x80000000" modulator1Feedback="0x80000000" modulator2Amount="0x80000000" modulator2Feedback="0x80000000" carrier1Feedback="0x80000000" carrier2Feedback="0x80000000" modFXRate="0x00000000" modFXDepth="0x00000000" delayRate="0x00000000" delayFeedback="0x80000000" reverbAmount="0x80000000" arpeggiatorRate="0x00000000" stutterRate="0x00000000" sampleRateReduction="0x80000000" bitCrush="0x80000000" modFXOffset="0x00000000" modFXFeedback="0x00000000">
						<envelope1 attack="0x80000000" decay="0xE6666654" sustain="0x7FFFFFD2" release="0x80000000"/>
						<envelope2 attack="0xE6666654" decay="0xE6666654" sustain="0xFFFFFFE9" release="0xE6666654"/>
						<patchCables>
							<patchCable source="velocity" destination="volume" amount="0x3FFFFFE8"/>
						</patchCables>
						<equalizer bass="0x00000000" treble="0x00000000" bassFrequency="0x00000000" trebleFrequency="0x00000000"/>
					</soundParams>
				</noteRow>
			</noteRows>
		</instrumentClip>
		<instrumentClip inKeyMode="1" yScroll="22" yScrollKeyboard="50" midiChannel="3" isPlaying="1" isSoloing="0" isArmedForRecording="1" length="1536" colourOffset="-36" section="1" selected="1">
			<noteRows>
				<noteRow y="40" noteData="0x0000015000000018401400000180000000234014000001C80000001C40140000021000000030401400000258000000244014000002A0000000304014000002D00000002640140000045000000018401400000480000000234014000004C80000001C40140000051000000030401400000558000000244014000005D0000000264014"/>
				<noteRow y="43" noteData="0x000000C000000030401400000108000000194014000003C000000030401400000408000000194014"/>
				<noteRow y="45" noteData="0x00000570000000184014"/>
				<noteRow y="47" noteData="0x000000300000001B401400000090000000304014000003300000001B40140000039000000030401400000588000000184014"/>
				<noteRow y="50" noteData="0x000005A0000000304014"/>
			</noteRows>
		</instrumentClip>
		<instrumentClip inKeyMode="1" yScroll="28" yScrollKeyboard="50" midiChannel="3" isPlaying="0" isSoloing="0" isArmedForRecording="1" length="768" colourOffset="-48" section="0">
			<noteRows>
				<noteRow y="52" noteData="0x0000015000000018401400000180000000234014000001C80000001C40140000021000000030401400000258000000244014000002A0000000204014000002D0000000264014"/>
				<noteRow y="55" noteData="0x000000C000000030401400000108000000194014"/>
				<noteRow y="59" noteData="0x000000300000001B401400000090000000304014"/>
			</noteRows>
		</instrumentClip>
	</sessionClips>
</song>
`;

test('is formatting ok?', () => {
  const output = beautifyXML(dummyXML);
  expect(output).toMatchSnapshot();
});
