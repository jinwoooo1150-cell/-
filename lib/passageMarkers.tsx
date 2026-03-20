import React from "react";
import { Text, TextStyle } from "react-native";

const BRACKET_MARKER_REGEX = /\[[A-Za-z]+\]/;
const HANGUL_MARKER_REGEX = /^[ㄱ-ㅎ]$/;

const isMarkerToken = (value: string) => {
  const token = value.trim();
  return BRACKET_MARKER_REGEX.test(token) || HANGUL_MARKER_REGEX.test(token);
};

const extractMarkers = (text: string) => {
  const found = new Set<string>();

  text.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (isMarkerToken(trimmed)) {
      found.add(trimmed);
      return;
    }

    const inlineMatch = line.match(/^(\s*)(\[[A-Za-z]+\]|[ㄱ-ㅎ])(?=\s)/);
    if (inlineMatch?.[2]) {
      found.add(inlineMatch[2]);
    }
  });

  return [...found];
};

const getExplicitReferences = (text: string, statement: string) => {
  const markers = extractMarkers(text);
  return new Set(markers.filter((marker) => statement.includes(marker)));
};

const normalizeSpacing = (text: string) =>
  text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export function stripPassageMarkers(text: string) {
  const cleanedLines = text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (isMarkerToken(trimmed)) {
        return "";
      }

      return line.replace(/^(\s*)(\[[A-Za-z]+\]|[ㄱ-ㅎ])(?=\s)/, "$1").trimEnd();
    })
    .join("\n");

  return normalizeSpacing(cleanedLines);
}

type PassageSegment = {
  marker?: string;
  text: string;
  highlighted: boolean;
};

function buildSegments(text: string, statement: string): PassageSegment[] {
  const explicitReferences = getExplicitReferences(text, statement);

  if (!explicitReferences.size) {
    return [{ text: stripPassageMarkers(text), highlighted: false }];
  }

  const segments: PassageSegment[] = [];
  let currentMarker: string | undefined;
  let currentText = "";

  const flush = () => {
    if (!currentText) return;
    segments.push({
      marker: currentMarker,
      text: currentText,
      highlighted: currentMarker ? explicitReferences.has(currentMarker) : false,
    });
    currentText = "";
  };

  text.split("\n").forEach((line, index, lines) => {
    const trimmed = line.trim();
    const suffix = index < lines.length - 1 ? "\n" : "";

    if (isMarkerToken(trimmed)) {
      flush();
      currentMarker = trimmed;
      currentText = `${trimmed}${suffix}`;
      return;
    }

    const inlineMatch = line.match(/^(\s*)(\[[A-Za-z]+\]|[ㄱ-ㅎ])(?=\s)(.*)$/);
    if (inlineMatch) {
      flush();
      currentMarker = inlineMatch[2];
      currentText = `${inlineMatch[1]}${inlineMatch[2]}${inlineMatch[3]}${suffix}`;
      return;
    }

    currentText += `${line}${suffix}`;
  });

  flush();

  return segments.length ? segments : [{ text, highlighted: false }];
}

export function renderMarkedPassage(
  text: string,
  statement: string,
  baseStyle?: TextStyle,
  highlightedStyle?: TextStyle,
) {
  const segments = buildSegments(text, statement);

  return segments.map((segment, index) => (
    <Text
      key={`segment-${index}`}
      style={segment.highlighted ? [baseStyle, highlightedStyle] : baseStyle}
    >
      {segment.text}
    </Text>
  ));
}
