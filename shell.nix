{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/c0d0be00d4ecc4b51d2d6948e37466194c1e6c51.tar.gz") {} }:
  pkgs.mkShell {
    buildInputs = [
      pkgs.pre-commit
      pkgs.typescript
    ];
  }
