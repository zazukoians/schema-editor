## Problem
* severity : high

At least one of the packages available from within Atom can break the whole system, to the extent that you can't get in to remove those packages.

## Proposed Resolution
* Somewhere near the package instructions MUST [1] be a note warning of this possibility, there SHOULD [2] be clear instructions for removing packages in this eventuality. (Probably an addition to :
2.1 Using Atom : Atom Packages)

 * e.g. on Ubuntu :
 * delete the contents of ~/.atom/packages reverts to bare-bones install (it seems)

* Packages SHOULD be better tested before acceptance

*I just had this scenario, foolishly installed some new packages when Atom was part of my main workflow, with a deadline pending. An uninstall/reinstall through synaptic didn't help (perhaps this suggests a tweak to the packaging..?) as it just picked up on the existing package dir. It took me a fair bit of googling to find the fix, lost maybe an hour in total, very distracting.*

I'd do the pull/fix/request thing myself if I had the time, but that deadline is still pending.

[1,2] in the RFC2119 sense.
