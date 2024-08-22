use std::io::BufRead;
use std::io::{self, BufReader};

use itertools::Itertools;

fn main() -> anyhow::Result<()> {
    let mut components: Vec<(*const u8, usize)> = vec![];
    let mut file_count = 0;
    let mut average_depth = 0f32;
    let mut reader = BufReader::new(io::stdin());
    let mut deepest = vec![];
    let mut deepest_is_dir = true;
    let mut buffer = Vec::new();
    loop {
        let n = reader.read_until(b'\n', &mut buffer)?;

        if n == 0 {
            break;
        }

        match parse_line(&buffer[buffer.len() - n..]).unwrap() {
            Line::ChangeDir { name } => match name {
                b".." => {
                    components.pop();
                }
                b"/" => {
                    components.clear();
                }
                _ => {
                    components.push((name.as_ptr(), name.len()));
                }
            },
            Line::DirEntry { name } => {
                if deepest.len() <= components.len() {
                    deepest.splice(0.., components.iter().cloned());
                    deepest.push((name.as_ptr(), name.len()));
                    deepest_is_dir = true;
                }
            }
            Line::FileEntry { name, .. } => {
                file_count += 1;
                average_depth += (components.len() as f32 - average_depth) / file_count as f32;

                if deepest.len() < components.len()
                    || (deepest.len() == components.len() && deepest_is_dir)
                {
                    deepest.splice(0.., components.iter().cloned());
                    deepest.push((name.as_ptr(), name.len()));
                    deepest_is_dir = false;
                }
            }
            Line::List => {}
        }
    }

    let deepest = deepest
        .iter()
        .map(|(data, len)| {
            String::from_utf8_lossy(unsafe { core::slice::from_raw_parts(*data, *len) })
        })
        .join("/");

    println!("{},\"/{}\",{}", file_count, deepest, average_depth);

    Ok(())
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum Line<'a> {
    ChangeDir { name: &'a [u8] },
    List,
    DirEntry { name: &'a [u8] },
    FileEntry { name: &'a [u8] },
}

fn parse_line(line: &[u8]) -> Option<Line<'_>> {
    if line.len() == 0 {
        return None;
    }

    let line = &line[..line.len() - 1];

    match line[0] {
        b'$' => {
            debug_assert!(line[1] == b' ');
            match line[2] {
                b'c' => {
                    debug_assert!(&line[2..5] == b"cd ");
                    return Some(Line::ChangeDir { name: &line[5..] });
                }
                b'l' => {
                    debug_assert!(&line[2..4] == b"ls");
                    return Some(Line::List);
                }
                _ => return None,
            }
        }
        b'0'..=b'9' => {
            let mut iter = line.split(|&x| x == b' ');
            let name = iter.next().and_then(|_| iter.next())?;

            return Some(Line::FileEntry { name });
        }
        b'd' => {
            debug_assert!(&line[0..4] == b"dir ");
            return Some(Line::DirEntry { name: &line[4..] });
        }
        _ => return None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse() {
        let lines = include_bytes!("../test.txt").split(|&x| x == b'\n');
        let expected = vec![
            Line::ChangeDir { name: b"/" },
            Line::List,
            Line::DirEntry { name: b"a" },
            Line::FileEntry { name: b"b.txt" },
        ];

        for (result, expected) in lines.map(|line| parse_line(line).unwrap()).zip(expected) {
            // println!("result: {:?} \n expected: {:?}", result, expected);
            assert_eq!(result, expected);
        }
    }
}
