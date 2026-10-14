# TouchDesigner render controller for the hero loop (lives as a Text DAT
# named render_ctrl inside /project1/pensive_bg). Run: op('render_ctrl').module.start()
# Renders 240 frames (8 s at 30 fps) to OUT as PNGs, stepping each frame
# deterministically so no frames are dropped. The two Movie File In TOPs
# (src_a, src_b) and the Cross TOP (loop_seam) blend the clip's tail into its
# head so the loop is seamless.
import os
C = op('/project1/pensive_bg')
OUT = r'C:\Users\Hobs\Videos\pensive-ronin-td\render'
N = 240; FADE = 60; WAIT = 5
SELF = "op('/project1/pensive_bg/render_ctrl').module"

def _const(par, v):
    par.mode = ParMode.CONSTANT
    par.val = v

def setframe(f):
    _const(C.op('src_a').par.index, f)
    _const(C.op('src_b').par.index, min(f + N, 299))
    _const(C.op('loop_seam').par.cross, max(0.0, 1.0 - f / float(FADE)))
    _const(C.op('grade').par.vec0valuex, f / 30.0)
    C.op('final').cook(force=True)

def start():
    os.makedirs(OUT, exist_ok=True)
    for fn in os.listdir(OUT):
        if fn.startswith('frame_') and fn.endswith('.png'):
            os.remove(os.path.join(OUT, fn))
    C.store('render_state', 'running')
    setframe(0)
    run(SELF + ".warm(0, 0)", delayFrames=WAIT * 3)

def warm(f, k):
    C.op('final').cook(force=True)
    if k < 2:
        run(SELF + ".warm(%d, %d)" % (f, k + 1), delayFrames=2)
    else:
        run(SELF + ".capture(%d)" % f, delayFrames=1)

def capture(f):
    C.op('final').save(os.path.join(OUT, 'frame_%04d.png' % f))
    C.store('render_frame', f)
    if f + 1 < N:
        setframe(f + 1)
        run(SELF + ".warm(%d, 0)" % (f + 1), delayFrames=1)
    else:
        C.store('render_state', 'done')
        restore()

def restore():
    C.op('src_a').par.index.expr = "min(int(absTime.frame/2) % 240 + 0, 299)"
    C.op('src_b').par.index.expr = "min(int(absTime.frame/2) % 240 + 240, 299)"
    C.op('loop_seam').par.cross.expr = "max(0.0, 1.0 - (int(absTime.frame/2) % 240) / 60.0)"
    C.op('grade').par.vec0valuex.expr = "(int(absTime.frame/2) % 240) / 30.0"
