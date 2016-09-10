import React, { PropTypes } from 'react';
import colors from '../../palette';
import * as SpanCalc from './SpanCalculator';
import './BranchProfile.scss';

/**
 * Gets styling for the branch-info spans
 */
function infoSpanStyle(flex, backgroundColor) {
  if (flex === 0) {
    return { display: 'none' };
  }
  return {
    backgroundColor,
    flex,
  };
}

const isNumber = d => !isNaN(d) && d !== null;

function getSpans(
  type,
  max,
  start,
  end,
  branchStart,
  branchEnd,
  activeIndex,
  successorIndex,
  pinnedIndex
) {
  // Set up the initial spans ranges; culling out empty ranges
  let spans = SpanCalc.initialSpans(max);
  const isCurrent = type === 'current';
  spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(0, end + 1, 'UNRELATED'));
  spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(start, end + 1, 'UNRELATED_UNIQUE'));

  if (isNumber(branchStart) && isNumber(branchEnd)) {
    const color = isCurrent ? 'CURRENT' : 'ANCESTOR';
    const span = new SpanCalc.Span(branchStart, branchEnd + 1, color);
    spans = SpanCalc.insertSpan(spans, span);
  }

  if (isNumber(activeIndex)) {
    const isWithinBranch = activeIndex >= branchStart && activeIndex <= branchEnd;
    let color = isWithinBranch ? 'CURRENT_ACTIVE' : 'LEGACY_ACTIVE';
    if (isNumber(pinnedIndex) && activeIndex === pinnedIndex + 1) {
      color = 'SUCCESSOR_ACTIVE';
    }
    const span = new SpanCalc.Span(activeIndex, activeIndex + 1, color);
    spans = SpanCalc.insertSpan(spans, span);
  }
  if (isNumber(pinnedIndex)) {
    const span = new SpanCalc.Span(pinnedIndex, pinnedIndex + 1, 'SUCCESSOR_PIN');
    spans = SpanCalc.insertSpan(spans, span);
  }
  if (isNumber(successorIndex)) {
    const color = isCurrent ? 'SUCCESSOR_ACTIVE' : 'SUCCESSOR';
    const span = new SpanCalc.Span(successorIndex, successorIndex + 1, color);
    spans = SpanCalc.insertSpan(spans, span);
  }
  return spans;
}

const BranchProfile = ({
  type,
  start,
  end,
  max,
  branchStart,
  branchEnd,
  activeStateIndex: activeIndex,
  successorStateIndex: successorIndex,
  pinnedStateIndex: pinnedIndex,
}) => {
  const infoSpans = getSpans(
    type,
    max,
    start,
    end,
    branchStart,
    branchEnd,
    activeIndex,
    successorIndex,
    pinnedIndex
  )
  .map(s => infoSpanStyle(s.length, colors[s.type]))
  .map((style, index) => (<div key={`branchinfo:${index}`} style={style} />));
  return (
    <div className="history-branch-profile">
      {infoSpans}
    </div>
  );
};

BranchProfile.propTypes = {
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  branchStart: PropTypes.number,
  branchEnd: PropTypes.number,
  max: PropTypes.number.isRequired,
  activeStateIndex: PropTypes.number,
  pinnedStateIndex: PropTypes.number,
  successorStateIndex: PropTypes.number,
  type: PropTypes.oneOf(['current', 'legacy']).isRequired,
};

export default BranchProfile;
