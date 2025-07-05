/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { exec } from 'node:child_process';

export function useGitBranchName(cwd: string): string | undefined {
  const [branchName, setBranchName] = useState<string | undefined>(undefined);

  useEffect(() => {
    exec(
      'git rev-parse --abbrev-ref HEAD',
      { cwd },
      (error, stdout, _stderr) => {
        if (error) {
          setBranchName(undefined);
          return;
        }
        const branch = stdout.toString().trim();
        if (branch && branch !== 'HEAD') {
          setBranchName(branch);
        } else {
          exec(
            'git rev-parse --short HEAD',
            { cwd },
            (error, stdout, _stderr) => {
              if (error) {
                setBranchName(undefined);
                return;
              }
              setBranchName(stdout.toString().trim());
            },
          );
        }
      },
    );
  }, [cwd]);

  return branchName;
}
