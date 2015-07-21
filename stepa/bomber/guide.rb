module Bomber
  class Guide < Bomber::Character
    def initialize(target)
      @target = target
      super(costume_lists, @target.x, @target.y, 0)
    end

    def costume_lists
      ["../image/up.png",
       "../image/down.png",
       "../image/left.png",
       "../image/right.png"]
    end

    def trace
      agl = @target.agl
      self.x, self.y = @target.x, @target.y
      case agl
      when :up
        self.y -= 4
        self.image = @costumes[0]
      when :down
        self.y += 32
        self.image = @costumes[1]
      when :left
        self.x -= 4
        self.image = @costumes[2]
      when :right
        self.x += 32
        self.image = @costumes[3]
      end
    end
  end
end