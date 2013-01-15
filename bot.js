function addZero(i) {
  return (i < 10)? "0" + i: i;
}
var bkbot={}, This=bkbot,
player_frame=top.frames["player"].window,
main_frame=top.frames["main"].window,
chat_frame=top.frames["chat"].window,
online_frame=top.frames["online"].window,
bottom_frame=top.frames["bottom"].window;
bkbot = {
  as:false,
  temp:false,
  status:false,
  info:{
    uid:false,
    name:false,
    lvl:false,
    hp:false,
    maxhp:false,
    room:false,
    city:'avaloncity'
  },
  getInfo:function(){
    if(!this.status){
      return;
    }
    if(!this.info.uid){
      var qid=$("a[href^='inf.php?']:eq(0)",main_frame.document).attr('href');
      if(qid) var uid=qid.replace(/inf\.php\?([0-9])/,'$1');
      if(!uid){
        var iq=$.ajax({
          url: '/main.php?edit=0.5997798033058643',
          async: false
        }).responseText;
        qid=$("a[href^='inf.php?']:eq(0)",iq).attr('href');
        if(qid) uid=qid.replace(/inf\.php\?([0-9])/,'$1');
        if(uid == 0){
          alert('��������� ���������� ID ���������.');
          this.start_stop();
          return;
        }else{
          this.info.uid=uid;
        }
      }else{
        this.info.uid=uid;
      }
    }
    if(this.info.uid == 0) return;
    var dinf=$.ajax({
      url: "inf.php?"+this.info.uid,
      async: false
    }).responseText;
    if(dinf.match(/AntiDDOS/g)){
      this.add_message('AntiDDOS ������ ��������');
      this.start_stop();
      setTimeout(function(){
        top.bkbot.start_stop();
      },8000);
      return;
    }
    var inf=$("td center:eq(0)",dinf).html().replace(/(\n(\r)?)/g,'');
    var inf2=$("td center:eq(1)",dinf).html().replace(/(\n(\r)?)/g,'');
    if(inf){
      var name=inf.match(/^.+<b>(.+)<\/b>.+/);
      if(name) this.info.name=name[1];
      var lvl=inf.match(/^.+<\/b>\s\[([0-9])\].+/);
      if(lvl) this.info.lvl=lvl[1];
      var hp=inf.match(/^.+name="HP2">:\s([0-9]{1,4})\/([0-9]{1,4})<\/div>.+/);
      if(hp) this.info.hp=hp[1];
      this.info.maxhp=hp[2];
      var city = main_frame.document.URL.match(/^.+p:\/\/(.+)\.oldbk\.com.+/);
      if(city) this.info.city = city[1];
      var room=inf2.match(/^.+<br><center><b>(.*)<\/b><\/center><\/small>.+/);
      if(room) this.info.room=room[1].replace(/"/g,"");
    }
  },
  ctime:function(){
    var date = new Date();
    return addZero(date.getHours())+':'+addZero(date.getMinutes());
  },
  add_message:function(text){
    if(text){
      var msg='<span class="date">'+this.ctime()+'</span> [<a href=\'javascript:;\'>Bot Inform</a>] <span class="stext" id="lpianJaem5yZm5udlpadnp2en5+ZmJk="><font color="#000000"><a href=\'javascript:top.AddToPrivate("'+this.info.name+'",false)\' class="private">private [ <span oncontextmenu="return OpenMenu(event,3)">'+this.info.name+'</span> ]</a> '+text+'</font></span> <br>';
      $('#mes',chat_frame.document).append(msg);
    }
  },
  create_block: function(){
    var  block=document.createElement("div");
    block.setAttribute("id","mainframeblock");
    block.setAttribute("style","display:none;");
    block.innerHTML="�������� ���";
    main_frame.document.body.appendChild(block);
  },
  start_stop: function(){
    var bt=chat_frame.document.getElementById('bot_bt');
    if(!this.status){
      this.status=true;
      bt.value='Stop bot';
      this.check_status();
    }else{
      this.status=false;
      bt.value='Start bot';
    }
  },
  git:function(it,cb){
    if(!this.status){
      return;
    }
    var url='/main.php?edit=1&razdel=0';
    $.get(url,function(d){
      var data=d.replace(/(\n(\r)?)/g,'');
      var tabled=$('table:eq(10)',data).html();
      var td=$('img[src$="'+it+'.gif"]',tabled).parent();
      if(!$.isArray(td)){
        var href=$('a:eq(0)',td).attr('href');
        main_frame.location="/main.php"+href;
      }else{
        console.log('git is array');
      }
    });
    if(cb){
      cb();
    }
  },
  getHP:function(cb){
    if(!this.status){
      return;
    }
    main_frame.location='/main.php';
    $("frame:eq(1)").one('load',function(){
      var hpm=$('#HP',main_frame.document).html().match(/name="HP2">:(.+)\/(.+)/);
      top.bkbot.info.hp=hpm[1];
      top.bkbot.info.maxhp=hpm[2];
      cb();
    });
  },
  getRoom:function(ccb,cb){
    if(!this.status){
      return;
    }
    online_frame.location.reload();
    $("frame:eq(3)").one('load',function(){
      var room=$('b:eq(0)',online_frame.document).html().replace(/^(.+)\s\(.+$/,"$1");
      top.bkbot.info.room=room;
      cb(ccb);
    });
  },
  goshop:function(cb){
    if(!this.status){
      return;
    }
    this.getRoom(cb,function(cb){
      if(top.bkbot.info.room == '�������'){
        cb();
      }else if(top.bkbot.info.room == '����������� �������'){
        main_frame.solo(2);
        $("frame:eq(1)").one('load',function(){
          cb();
        });
      }else{
        main_frame.location='/main.php?goto=plo';
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.goshop(cb);
          });
        });
      }
    });
  },
  gofrm:function(cb){
    if(!this.status){
      return;
    }
    this.getRoom(cb,function(cb){
      if(top.bkbot.info.room == '�������'){
        main_frame.location='/city.php?cp=1';
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gofrm(cb);
          });
        });
      }else if(top.bkbot.info.room == '����������� �������'){
        main_frame.solo(1);
        $("frame:eq(1)").one('load',function(){
          main_frame.location='/main.php?got=1&room2=�����';
          $("frame:eq(1)").one('load',function(){
            main_frame.location='/main.php';
            $("frame:eq(1)").one('load',function(){
              cb();
            });
          });
        });
      }else if(top.bkbot.info.room == '������� ��� �������� 2'){
        cb();
      }
    });
  },
  gobank:function(cb){
    if(!this.status){
      return;
    }
    this.getRoom(cb,function(cb){
      if(top.bkbot.info.room == '����'){
        cb();
      }else if(top.bkbot.info.room == '����������� �������'){
        main_frame.solo(7);
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gobank(cb);
          });
        });
      }else if(top.bkbot.info.room == '��������� �������'){
        main_frame.location='/city.php?strah=1';
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gobank(cb);
          });
        });
      }else if(top.bkbot.info.room == '����������� �����'){
        main_frame.solo(5);
        $("frame:eq(1)").one('load',function(){
          cb();
        });
      }else{
        main_frame.location='/main.php?goto=plo';
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gobank(cb);
          });
        });
      }
    });
  },
  gobr:function(cb){
    if(!this.status){
      return;
    }
    this.getRoom(cb,function(cb){
      if(top.bkbot.info.room == '����'){
        main_frame.location='/city.php?strah=1';
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gobr(cb);
          });
        });
      }else if(top.bkbot.info.room == '����������� �����'){
        main_frame.solo(4);
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gobr(cb);
          });
        });
      }else if(top.bkbot.info.room == '����������� �������'){
        main_frame.solo(4);
        $("frame:eq(1)").one('load',function(){
          cb();
        });
      }else{
        cb();
      }
    });
  },
  gohz:function(cb){
    if(!this.status){
      return;
    }
    this.getRoom(cb,function(cb){
      if(top.bkbot.info.room == '��������� ����������'){
        main_frame.location='/city.php?cp=1';
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gohz(cb);
          });
        });
      }else if(top.bkbot.info.room == '����������� �������'){
        main_frame.solo(8);
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gohz(cb);
          });
        });
      }else if(top.bkbot.info.room == '�������� �����'){
        main_frame.solo(5);
        $("frame:eq(1)").one('load',function(){
          cb();
        });
      }else if(top.bkbot.info.room == '������� �������'){
        cb();
      }
    });
  },
  gocm:function(cb){
    if(!this.status){
      return;
    }
    this.getRoom(cb,function(cb){
      if(top.bkbot.info.room == '������� �������'){
        main_frame.location='/city.php?bps=1';
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gocm(cb);
          });
        });
      }else if(top.bkbot.info.room == '�������� �����'){
        main_frame.solo(4);
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gocm(cb);
          });
        });
      }else if(top.bkbot.info.room == '����������� �������'){
        main_frame.solo(3);
        $("frame:eq(1)").one('load',function(){
          cb();
        });
      }else{
        cb();
      }
    });
  },
  gotu:function(cb){
    if(!this.status){
      return;
    }
    this.getRoom(cb,function(cb){
      if(top.bkbot.info.room == '������������ �������'){
        main_frame.location='/city.php?cp=1';
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gotu(cb);
          });
        });
      }else if(top.bkbot.info.room == '����������� �������'){
        main_frame.solo(8);
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gotu(cb);
          });
        });
      }else if(top.bkbot.info.room == '�������� �����'){
        main_frame.solo(66);
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            cb();
          });
        });
      }else if(top.bkbot.info.room == '�������� �����'){
        cb();
      }
    });
  },
  gopo:function(cb){
    if(!this.status){
      return;
    }
    this.getRoom(cb,function(cb){
      if(top.bkbot.info.room == '�������� �����'){
        main_frame.location='/rentalshop.php?exit=1';
        $("frame:eq(1)").one('load',function(){
          top.bkbot.gopo(cb);
        });
      }else if(top.bkbot.info.room == '�������� �����'){
        main_frame.solo(20);
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gopo(cb);
          });
        });
      }else if(top.bkbot.info.room == '�������� �����'){
        main_frame.solo(4);
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gopo(cb);
          });
        });
      }else if(top.bkbot.info.room == '����������� �������'){
        main_frame.solo(6);
        $("frame:eq(1)").one('load',function(){
          cb();
        });
      }else if(top.bkbot.info.room == '�����'){
        cb();
      }
    });
  },
  gocv:function(cb){
    if(!this.status){
      return;
    }
    this.getRoom(cb,function(cb){
      if(top.bkbot.info.room == '��������� �������'){
        cb();
      }else if(top.bkbot.info.room == '����������� �������'){
        main_frame.solo(7);
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gocv(cb);
          });
        });
      }else if(top.bkbot.info.room == '�����'){
        main_frame.location='/city.php?cp=1';
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gocv(cb);
          });
        });
      }else if(top.bkbot.info.room == '����������� �����'){
        main_frame.solo(6);
        $("frame:eq(1)").one('load',function(){
          cb();
        });
      }
    });
  },
  gofr:function(cb){
    if(!this.status){
      return;
    }
    this.getRoom(cb,function(cb){
      if(top.bkbot.info.room == '����'){
        main_frame.location='/city.php?strah=1';
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gofr(cb);
          });
        });
      }else if(top.bkbot.info.room == '����������� �����'){
        main_frame.solo(4);
        $("frame:eq(1)").one('load',function(){
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gofr(cb);
          });
        });
      }else if(top.bkbot.info.room == '����������� �������'){
        main_frame.solo(1);
        $("frame:eq(1)").one('load',function(){
          main_frame.location='/main.php?got=1&room2=�����';
          $("frame:eq(1)").one('load',function(){
            main_frame.location='/main.php';
            $("frame:eq(1)").one('load',function(){
              cb();
            });
          });
        });
      }else if(top.bkbot.info.room == '������� ��� �������� 2'){
        cb();
      }
    });
  },
  stat:function(s,n){
    //  s = sila, lovk, inta, vinos
    main_frame.location="/main.php?up=1&edit=1&"+s+"="+n;
  },
  vlad:function(s,n,cb){
    // s = 1 (kas), 2 (mech), 3 (dub), 4 (top)
    var ql=(s-1);
    main_frame.location='/main.php?edit=1';
    $("frame:eq(1)").one('load',function(){
      var href=$('a[href^="?up="]:eq('+ql+')',main_frame.document).attr('href');
      if(n > 1){
        main_frame.location='/main.php'+href;
        $("frame:eq(1)").one('load',function(){
          top.bkbot.vlad(s,(n-1),cb);
        });
      }else{
        main_frame.location='/main.php'+href;
        $("frame:eq(1)").one('load',function(){
          cb();
        });
      }
    });
  },
  use: function(it,r,cb){
    if(!this.status){
      return;
    }
    var url='/main.php?edit=1&razdel='+r;
    $.get(url,function(d){
      var data=d.replace(/(\n(\r)?)/g,'');
      var tabled=$('table:eq(10)',data).html();
      var td=$('img[src$="'+it+'.gif"]',tabled).parent();
      if(!$.isArray(td)){
        var href=$('a:eq(0)',td).attr('onclick');
        //console.log(href);
        var hm=href.match(/window\.location='main\.php\?edit=1&use=(.+)';/);
        main_frame.location="/main.php?edit=1&use="+hm[1];
      }else{
        console.log('git is array');
      }
    });
    if(cb){
      cb();
    }
  },
  botfight:function(){
    //console.log(top.bkbot.info.hp+' < '+top.bkbot.info.maxhp);
    if(main_frame.document.URL.indexOf("/zayavka.php")!=-1){
      if(top.bkbot.info.hp < top.bkbot.info.maxhp){
        main_frame.location='/main.php';
        $("frame:eq(1)").one('load',function(){
          top.bkbot.autobk();
        });
        return;
      }
      $('input[name="open"]',main_frame.document).click();
      $("frame:eq(1)").one('load',function(){
        main_frame.location='/zayavka.php?level=fiz&trainstart=1';
        setTimeout(top.bkbot.autobk(),3000);
      });
    }else if(main_frame.document.URL.indexOf("/fbattle.php")!=-1){
      top.bkbot.autobk();
    }else{
      this.getHP(function(){
        if(!top.bkbot.status){
          return;
        }
        if(main_frame.document.URL.indexOf("/main.php")!=-1){
          if(top.bkbot.info.hp < top.bkbot.info.maxhp){
            top.bkbot.use('food_l8',2,function(){
              top.bkbot.botfight();
            });
          }else{
//            if(main_frame.document.URL.indexOf("/main.php?edit=1")!=-1){
//              var cs=$("body",main_frame.document).html().replace(/(\n(\r)?)/g,'');
//              var csr=cs.match(/���������\s����������:\s([0-9])<\/font>/);
//              if(csr[1] != null){
//                top.bkbot.stat('sila',csr[1]);
//                $("frame:eq(1)").one('load',function(){
//                  main_frame.location='/zayavka.php?level=fiz';
//                  $("frame:eq(1)").one('load',function(){
//                    top.bkbot.botfight();
//                  });
//                });
//              }
//            }else{
              main_frame.location='/zayavka.php?level=fiz';
              $("frame:eq(1)").one('load',function(){
                top.bkbot.botfight();
              });
//            }
          }

        }
      });
    }
  },
  autobk:function(){
    if(main_frame.document.body.innerHTML.indexOf('>��� ��������! ����� ���� �������� �����')!=-1){
      console.log('end');
      $("frame:eq(1)").one('load',function(){
        top.bkbot.check_status();
      });
      $('input[name="end"]',main_frame.document).click();
    }else if(main_frame.document.body.innerHTML.indexOf('>�������, ���� ��� �������� ������ ������...')!=-1){
      console.log('dead');
      $("frame:eq(1)").one('load',function(){
        top.bkbot.autobk();
      });
      return ;
    }else if(main_frame.document.body.innerHTML.indexOf('>������� ���� ����������...')!=-1){
      console.log('wait');
      main_frame.location.reload();
      $("frame:eq(1)").one('load',function(){
        top.bkbot.autobk();
      });
    }else{
      console.log('check');
      setTimeout(top.bkbot.autobk,1000);
    }
  },
  check_quest:function(){
    if(!top.bkbot.status){
      return;
    }
    top.bkbot.check_answer(function(){
      var url='/main.php?edit=1&effects=1';
      $.get(url,function(d){
        var data=d.replace(/(\n(\r)?)/g,'');
        var q1=data.match(/������\s�\s����\s����\s<b>3\s���������\s�����<\/b>/);
        var q2=data.match(/<\/b>\s�\s�����\s<b>�������<\/b>/);
        var q3=data.match(/���\s��\s�������\s<b>�������<\/b>\.<br>/);
        var q4=data.match(/����\s������\s�������:<\/font><\/u>/);
        var q5=data.match(/\s������\s2\s����������\s��������\s���\s�������,\s�������\s��\s�����<\/b>/);
        var q6=data.match(/��\s���\s������\s<b>1��\s������<\/b>!/);
        var q7=data.match(/�������\s����\s������\s<b>����������\s���<\/b>/);
        var q8=data.match(/�\s�����\s�\s������\s<b>�����<\/b>/);
        var q81=data.match(/<b>������\s����\s�\s�����\s�\s����<\/b>/);
        var q9=data.match(/�\s�����\s\(1 ��� = 10 ����\)\s���\s������\s������\s����\s�/);
        var q10=data.match(/����\s�����\s���������\s�\s���/);
        var q11=data.match(/���\s��\s�������\s<b>"������\s�������"/);
        var q12=data.match(/���\s�\s<b>������\s������������\s�������</);
        var q13=data.match(/<b>�������� �����<\/b>\./);
        var q14=data.match(/��������\s�����,\s���\s�\s����\s�����\s����!</);
        var q15=data.match(/����\s������\s������\s-\s<b>"�����"<\/b>/);
        var q16=data.match(/���\s�\s<b>���������\s�������<\/b>/);
        var q17=data.match(/�����\s�\s������\s<b>"����������"<\/b>/);
        if(main_frame.document.URL.indexOf("/fbattle.php")!=-1){
          top.bkbot.add_message('���� ���!');
          top.bkbot.autobk();
        }else if(q1){
          top.bkbot.add_message('���������� ������: ������ �����!');
          top.bkbot.stat('vinos',3);
          $("frame:eq(1)").one('load',function(){
            top.bkbot.check_quest();
          });
        }else if(q2){
          top.bkbot.add_message('���������� ������: ����� �������!');
          top.bkbot.git('roba1',function(){
            $("frame:eq(1)").one('load',function(){
              top.bkbot.check_quest();
            });
          });
        }else if(q3){
          top.bkbot.add_message('���������� ������: ����� � �������!');
          top.bkbot.goshop(function(){
            top.bkbot.check_quest();
          });
        }else if(q4){
          if(!top.bkbot.temp){
            top.bkbot.temp=1;
            top.bkbot.add_message('���������� ������: ������� ������!');
            main_frame.location='/shop.php?otdel=12&sid=&0.286790872806733';
            $("frame:eq(1)").one('load',function(){
              top.bkbot.check_quest();
            });
          }else if(top.bkbot.temp == 1){
            main_frame.location='/shop.php?otdel=12&set=143&sid=';
            top.bkbot.temp=false;
            $("frame:eq(1)").one('load',function(){
              top.bkbot.check_quest();
            });
          }
        }else if(q5){
          top.bkbot.add_message('���������� ������: ������������� ��������!');
          top.bkbot.vlad(3,2,function(){
            top.bkbot.check_quest();
          });
        }else if(q6){
          if(!top.bkbot.temp){
            top.bkbot.add_message('���������� ������: ������� � ������� ��� �������� 2!');
            top.bkbot.temp=1;
            top.bkbot.stat('lovk',3);
            $("frame:eq(1)").one('load',function(){
              top.bkbot.stat('sila',4);
              $("frame:eq(1)").one('load',function(){
                top.bkbot.git('dubina1', function(){
                  $("frame:eq(1)").one('load',function(){
                    top.bkbot.check_quest();
                  });
                });
              });
            });
          }else if(top.bkbot.temp == 1){
            top.bkbot.temp=false;
            top.bkbot.gofrm(function(){
              top.bkbot.check_quest();
            });
          }
        }else if(q7){
          top.bkbot.add_message('���������� ������: ������ ���!');
          top.bkbot.botfight();
        }else if(q8){
          top.bkbot.add_message('���������� ������: ����� � ����!');
          top.bkbot.gobank(function(){
            top.bkbot.check_quest();
          });
        }else if(q81){
          if(!top.bkbot.temp){
            top.bkbot.add_message('���������� ������: �������� ����� � �����!');
            top.bkbot.temp=1;
            $('input[name="rpass"]',main_frame.document).val('123');
            $('input[name="rpass2"]',main_frame.document).val('123');
            $('input[name="reg"]',main_frame.document).click();
            $("frame:eq(1)").one('load',function(){
              top.bkbot.check_quest();
            });
          }else if(top.bkbot.temp == 1){
            top.bkbot.temp=false;
            $('input[name="pass"]',main_frame.document).val('123');
            $('input[name="enter"]',main_frame.document).click();
            $("frame:eq(1)").one('load',function(){
              top.bkbot.check_quest();
            });
          }
        }else if(q9){
          top.bkbot.add_message('���������� ������: ����� � ��������� ����������!');
          top.bkbot.gobr(function(){
            top.bkbot.check_quest();
          });
        }else if(q10){
          top.bkbot.add_message('���������� ������: ������ �����!');
          var href=$("a[href*='full']:eq(0)",main_frame.document).attr('href');
          main_frame.location='/repair.php'+href;
          $("frame:eq(1)").one('load',function(){
            top.bkbot.check_quest();
          });
        }else if(q11){
          top.bkbot.add_message('���������� ������: ����� � ������ �������!');
          top.bkbot.gohz(function(){
            top.bkbot.check_quest();
          });
        }else if(q12){
          top.bkbot.add_message('���������� ������: ����� � ������������ �������!');
          top.bkbot.gocm(function(){
            top.bkbot.check_quest();
          });
        }else if(q13){
          top.bkbot.add_message('���������� ������: ����� �� �������� �����!');
          top.bkbot.gotu(function(){
            top.bkbot.check_quest();
          });
        }else if(q14){
          top.bkbot.add_message('���������� ������: ����� � �������� �����!');
          main_frame.solo(47);
          $("frame:eq(1)").one('load',function(){
            top.bkbot.check_quest();
          });
        }else if(q15){
          top.bkbot.add_message('���������� ������: ����� �� �����!');
          top.bkbot.gopo(function(){
            top.bkbot.check_quest();
          });
        }else if(q16){
          top.bkbot.add_message('���������� ������: ����� � ��������� �������!');
          top.bkbot.gocv(function(){
            top.bkbot.check_quest();
          });
        }else if(q17){
          top.bkbot.add_message('���������� ������: ������� �����!');
          main_frame.location='/fshop.php?otdel=7&sid=&';
          $("frame:eq(1)").one('load',function(){
            main_frame.location='/fshop.php?otdel=7&set=12225&sid=';
            $("frame:eq(1)").one('load',function(){
              main_frame.location='/fshop.php?present=1';
              $("frame:eq(1)").one('load',function(){
                $('input[name="to_login"]',main_frame.document).val('�����������');
                $('input[type="submit"]:eq(1)',main_frame.document).click();
                $("frame:eq(1)").one('load',function(){
                  top.bkbot.check_status();
                });
              });
            });
          });
        }
      });
    });
  },
  check_status:function(){
    this.getInfo();
    if(!this.status){
      return;
    }
    if(!this.info.uid){
      alert('��������� ���������� ID ������, �������� �������� � ��������� �����.');
      this.start_stop();
      return;
    }else if(this.info.lvl >= 3){
      this.add_message('������������ ������� �������� 3�.');
      this.start_stop();
      return;
    }else if(this.info.lvl == 2){
      if(this.info.room == '��������� �������'){
        top.bkbot.add_message('����������� ������, � ���� � ���� ������������ ����.');
        top.bkbot.check_answer(function(){
          top.bkbot.vlad(3,1,function(){
            top.bkbot.gobank(function(){
              if($('input[name="pass"]',main_frame.document).length > 0){
                $('input[name="pass"]',main_frame.document).val('123');
                $('input[name="enter"]',main_frame.document).click();
                $("frame:eq(1)").one('load',function(){
                  top.bkbot.check_status();
                });
              }else{
                top.bkbot.check_status();
              }
            });
          });
        });
      }else if(this.info.room == '����'){
        $('input[name="ok"]',main_frame.document).val(5);
        $('input[name="change"]',main_frame.document).click();
        $("frame:eq(1)").one('load',function(){
          $('input[name="ok"]',main_frame.document).val(50);
          $('input[name="out"]',main_frame.document).click();
          $("frame:eq(1)").one('load',function(){
            top.bkbot.gofr(function(){
              top.bkbot.check_status();
            });
          });
        });
      }else if(main_frame.document.URL.indexOf("main.php")!=-1){
        this.add_message('��� �� ����');
        this.botfight();
      }
    }else if(this.info.lvl <= 1){
      this.add_message('�������� �������');
      this.check_quest();
    }
  },
  check_answer:function(cb){
    if($('#quest',main_frame.document).length !== 0){
      if(!$('#quest',main_frame.document).is(':hidden')){
        var qa=$('#quest',main_frame.document).html();
        var i=0, ln=0;
        while(ln === 0){
          ln=$('a:eq('+i+')',qa).attr('onclick');
          i++;
        }
        var lm=ln.match(/answer\("([0-9]{1,2})","([0-9]{1,2})"\);/);
        if(lm){
          main_frame.answer(lm[1],lm[2]);
          setTimeout(function(){
            top.bkbot.check_answer(cb);
          },2000);
        }
      }else{
        cb();
      }
    }else{
      cb();
    }
  },
  init: function(){
    var bt=document.createElement("input");
    bt.setAttribute("type","button");
    bt.setAttribute("id","bot_bt");
    bt.setAttribute("style","position:fixed;top:2px;right:5px;z-index:999;");
    bt.setAttribute("value","Start bot");
    bt.setAttribute("onclick",'top.bkbot.start_stop();');
    chat_frame.document.body.appendChild(bt);
  }
};
function init(){
  if(!window.jQuery){
    setTimeout();
  }else{
    $(top.document).ready(function(){
      bkbot.init();
      $("frameset:eq(1)",top.document).attr("rows","90%,*,0");
    });
  }
}
init();