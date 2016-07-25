// const log = require('debug')('dag-history-component:BranchProfile');
import React, { PropTypes } from 'react';
import { colors } from '../../palette';
import * as SpanCalc from './SpanCalculator';
require('./BranchProfile.sass');

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
  successorIndex
) {
  // Set up the initial spans ranges; culling out empty ranges
  let spans = SpanCalc.initialSpans(max);
  spans = SpanCalc.insertSpan(spans, new SpanCalc.Span(start, end + 1, 'UNRELATED'));
  if (isNumber(branchStart) && isNumber(branchEnd)) {
    const color = type === 'current' ? 'CURRENT' : 'ANCESTOR';
    const span = new SpanCalc.Span(branchStart, branchEnd + 1, color);
    spans = SpanCalc.insertSpan(spans, span);
  }

  if (isNumber(activeIndex)) {
    const color = type === 'current' ? 'CURRENT_ACTIVE' : 'LEGACY_ACTIVE';
    const span = new SpanCalc.Span(activeIndex, activeIndex + 1, color);
    spans = SpanCalc.insertSpan(spans, span);
  }
  if (isNumber(successorIndex)) {
    const span = new SpanCalc.Span(successorIndex, successorIndex + 1, 'SUCCESSOR');
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
}) => {
  const infoSpans = getSpans(
    type,
    max,
    start,
    end,
    branchStart,
    branchEnd,
    activeIndex,
    successorIndex
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
  successorStateIndex: PropTypes.number,
  type: PropTypes.oneOf(['current', 'legacy']).isRequired,
  paths: PropTypes.shape({
    color: PropTypes.string.isRequired,
    ingressEars: PropTypes.arrayOf(PropTypes.number),
    egressEars: PropTypes.arrayOf(PropTypes.number),
    traversal: PropTypes.shape({
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired,
    }),
    verticals: PropTypes.arrayOf(PropTypes.number),
  }),
};

export default BranchProfile;