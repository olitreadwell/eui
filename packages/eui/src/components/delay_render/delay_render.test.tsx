/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { act } from '@testing-library/react';
import { render } from '../../test/rtl';

import { EuiDelayRender } from './delay_render';

describe('EuiDelayRender', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing before the delay has elapsed', () => {
    const { container } = render(
      <EuiDelayRender delay={500}>
        <span>Child</span>
      </EuiDelayRender>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the children once the delay has elapsed', () => {
    const { container } = render(
      <EuiDelayRender delay={500}>
        <span>Child</span>
      </EuiDelayRender>
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(container).toHaveTextContent('Child');
  });

  it('defaults to a 500ms delay when none is passed', () => {
    const { container } = render(
      <EuiDelayRender>
        <span>Child</span>
      </EuiDelayRender>
    );

    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(container).toBeEmptyDOMElement();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(container).toHaveTextContent('Child');
  });

  it('respects a custom delay', () => {
    const { container } = render(
      <EuiDelayRender delay={1000}>
        <span>Child</span>
      </EuiDelayRender>
    );

    act(() => {
      jest.advanceTimersByTime(999);
    });
    expect(container).toBeEmptyDOMElement();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(container).toHaveTextContent('Child');
  });

  it('clears the pending timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
    const { unmount } = render(
      <EuiDelayRender delay={500}>
        <span>Child</span>
      </EuiDelayRender>
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
