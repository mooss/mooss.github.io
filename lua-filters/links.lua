-- Inspired by https://stackoverflow.com/a/49396058.
-- Will probably rewrite valid .org websites also but will do for now.
function Link(el)
  el.target = string.gsub(el.target, "%.org$", ".html")
  return el
end
