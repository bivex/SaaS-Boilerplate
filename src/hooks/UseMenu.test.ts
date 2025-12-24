/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:34
 * Last Updated: 2025-12-24T01:03:41
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import {act, renderHook} from '@testing-library/react';

import {useMenu} from './UseMenu';

describe('UseMenu', () => {
    describe('Render hook', () => {
        it('shouldn\'t show the menu by default', async () => {
            const {result} = renderHook(() => useMenu());

            expect(result.current.showMenu).toBeFalsy();
        });

        it('should make the menu visible by toggling the menu', () => {
            const {result} = renderHook(() => useMenu());

            act(() => {
                result.current.handleToggleMenu();
            });

            expect(result.current.showMenu).toBeTruthy();
        });

        it('shouldn\'t make the menu visible after toggling and closing the menu', () => {
            const {result} = renderHook(() => useMenu());

            act(() => {
                result.current.handleClose();
            });

            expect(result.current.showMenu).toBeFalsy();
        });

        it('shouldn\'t make the menu visible after toggling the menu twice', () => {
            const {result} = renderHook(() => useMenu());

            act(() => {
                result.current.handleToggleMenu();
                result.current.handleToggleMenu();
            });

            expect(result.current.showMenu).toBeFalsy();
        });
    });
});
