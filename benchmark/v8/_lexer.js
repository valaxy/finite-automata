function lexer (input) {
  var s = 0
    , a = [2, 3]
    , i = 0
    , ii = input.length
    , c = 'c'
    , m = 0
    , r = []
  for (; i<ii; ++i) {
    c = input[i]
    switch (s) {
      case 0:
        switch (c) {
          case 98: s = 1; break
          case 115: s = 11; break
          case 99: s = 18; break
          case 119: s = 8; break
          case 121: s = 7; break
          case 118: s = 9; break
          case 101: s = 16; break
          case 116: s = 10; break
          case 100: s = 17; break
          case 102: s = 15; break
          case 110: s = 5; break
          case 105: s = 12; break
          case 108: s = 4; break
          case 114: s = 6; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          m = i + 1
        }
      break
      case 1:
        switch (c) {
          case 114: s = 19; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 2:
        switch (c) {
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 3:
        switch (c) {
          case 115: s = 51; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 4:
        switch (c) {
          case 101: s = 34; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 5:
        switch (c) {
          case 101: s = 33; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 6:
        switch (c) {
          case 101: s = 23; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 7:
        switch (c) {
          case 105: s = 30; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 8:
        switch (c) {
          case 105: s = 29; break
          case 104: s = 28; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 9:
        switch (c) {
          case 111: s = 27; break
          case 97: s = 37; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 10:
        switch (c) {
          case 104: s = 32; break
          case 114: s = 31; break
          case 121: s = 26; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 11:
        switch (c) {
          case 119: s = 25; break
          case 117: s = 24; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 12:
        switch (c) {
          case 109: s = 35; break
          case 110: s = 3; break
          case 102: s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 13:
        switch (c) {
          case 102: s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 14:
        switch (c) {
          case 110: s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 15:
        switch (c) {
          case 105: s = 21; break
          case 111: s = 37; break
          case 117: s = 22; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 16:
        switch (c) {
          case 120: s = 36; break
          case 108: s = 38; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 17:
        switch (c) {
          case 111: s = 2; break
          case 101: s = 40; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 18:
        switch (c) {
          case 97: s = 39; break
          case 108: s = 20; break
          case 111: s = 41; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 19:
        switch (c) {
          case 101: s = 43; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 20:
        switch (c) {
          case 97: s = 44; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 21:
        switch (c) {
          case 110: s = 49; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 22:
        switch (c) {
          case 110: s = 50; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 23:
        switch (c) {
          case 116: s = 52; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 24:
        switch (c) {
          case 112: s = 60; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 25:
        switch (c) {
          case 105: s = 42; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 26:
        switch (c) {
          case 112: s = 58; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 27:
        switch (c) {
          case 105: s = 57; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 28:
        switch (c) {
          case 105: s = 54; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 29:
        switch (c) {
          case 116: s = 56; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 30:
        switch (c) {
          case 101: s = 55; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 31:
        switch (c) {
          case 121: s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 32:
        switch (c) {
          case 105: s = 59; break
          case 114: s = 53; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 33:
        switch (c) {
          case 119: s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 34:
        switch (c) {
          case 116: s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 35:
        switch (c) {
          case 112: s = 61; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 36:
        switch (c) {
          case 112: s = 61; break
          case 116: s = 48; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 37:
        switch (c) {
          case 114: s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 38:
        switch (c) {
          case 115: s = 64; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 39:
        switch (c) {
          case 115: s = 64; break
          case 116: s = 63; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 40:
        switch (c) {
          case 108: s = 47; break
          case 102: s = 46; break
          case 98: s = 45; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 41:
        switch (c) {
          case 110: s = 62; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 42:
        switch (c) {
          case 116: s = 63; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 43:
        switch (c) {
          case 97: s = 65; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 44:
        switch (c) {
          case 115: s = 59; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 45:
        switch (c) {
          case 117: s = 67; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 46:
        switch (c) {
          case 97: s = 68; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 47:
        switch (c) {
          case 101: s = 69; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 48:
        switch (c) {
          case 101: s = 70; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 49:
        switch (c) {
          case 97: s = 71; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 50:
        switch (c) {
          case 99: s = 72; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 51:
        switch (c) {
          case 116: s = 73; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 52:
        switch (c) {
          case 117: s = 74; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 53:
        switch (c) {
          case 111: s = 33; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 54:
        switch (c) {
          case 108: s = 64; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 55:
        switch (c) {
          case 108: s = 57; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 56:
        switch (c) {
          case 104: s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 57:
        switch (c) {
          case 100: s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 58:
        switch (c) {
          case 101: s = 75; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 59:
        switch (c) {
          case 115: s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 60:
        switch (c) {
          case 101: s = 37; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 61:
        switch (c) {
          case 111: s = 76; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 62:
        switch (c) {
          case 116: s = 66; break
          case 115: s = 34; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 63:
        switch (c) {
          case 99: s = 56; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 64:
        switch (c) {
          case 101: s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 65:
        switch (c) {
          case 107: s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 66:
        switch (c) {
          case 105: s = 77; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 67:
        switch (c) {
          case 103: s = 78; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 68:
        switch (c) {
          case 117: s = 79; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 69:
        switch (c) {
          case 116: s = 64; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 70:
        switch (c) {
          case 110: s = 80; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 71:
        switch (c) {
          case 108: s = 81; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 72:
        switch (c) {
          case 116: s = 82; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 73:
        switch (c) {
          case 97: s = 83; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 74:
        switch (c) {
          case 114: s = 14; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 75:
        switch (c) {
          case 111: s = 13; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 76:
        switch (c) {
          case 114: s = 34; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 77:
        switch (c) {
          case 110: s = 84; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 78:
        switch (c) {
          case 103: s = 60; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 79:
        switch (c) {
          case 108: s = 34; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 80:
        switch (c) {
          case 100: s = 59; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 81:
        switch (c) {
          case 108: s = 31; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 82:
        switch (c) {
          case 105: s = 85; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 83:
        switch (c) {
          case 110: s = 86; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 84:
        switch (c) {
          case 117: s = 64; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 85:
        switch (c) {
          case 111: s = 14; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 86:
        switch (c) {
          case 99: s = 58; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(m, i)
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
    }
  }
  if (a.indexOf(s) >= 0) {
    // Append the matched token
    r.push(m, i)
  }
  return r
}
;module.exports=lexer;